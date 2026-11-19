import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { INITIAL_PINS } from '../data/mockPins'
import { INITIAL_BOARDS } from '../data/mockBoards'
import { useNotification } from './NotificationContext'
import { useAuth } from './AuthContext'
import { isSupabaseConfigured } from '../lib/supabase'
import {
  fetchPins as fetchPinsFromDb,
  createPin as createPinInDb,
  deletePin as deletePinInDb
} from '../services/pinService'
import {
  fetchUserBoards as fetchUserBoardsFromDb,
  createBoard as createBoardInDb,
  updateBoard as updateBoardInDb,
  deleteBoard as deleteBoardInDb,
  savePinToBoard as savePinToBoardInDb,
  removePinFromBoard as removePinFromBoardInDb
} from '../services/boardService'

const PinContext = createContext(null)

export function PinProvider({ children }) {
  const { showToast } = useNotification()
  const { currentUser } = useAuth()
  const isConfigured = isSupabaseConfigured()

  // Pins state
  const [pins, setPins] = useState(() => {
    try {
      const stored = localStorage.getItem('pinspace_pins')
      return stored ? JSON.parse(stored) : INITIAL_PINS
    } catch {
      return INITIAL_PINS
    }
  })

  // Boards state
  const [boards, setBoards] = useState(() => {
    try {
      const stored = localStorage.getItem('pinspace_boards')
      return stored ? JSON.parse(stored) : INITIAL_BOARDS
    } catch {
      return INITIAL_BOARDS
    }
  })

  // Saved pins tracking (quick lookups)
  const [savedPinIds, setSavedPinIds] = useState(() => {
    try {
      const stored = localStorage.getItem('pinspace_saved_pins')
      if (stored) return JSON.parse(stored)
      const allIds = INITIAL_BOARDS.flatMap(b => b.pinIds || [])
      return Array.from(new Set(allIds))
    } catch {
      return []
    }
  })

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [isLoadingPins, setIsLoadingPins] = useState(false)
  const [pinsError, setPinsError] = useState(null)

  // Refresh pins from Supabase database
  const refreshPins = useCallback(async () => {
    if (!isConfigured) return
    try {
      setIsLoadingPins(true)
      setPinsError(null)
      const dbPins = await fetchPinsFromDb({ limit: 60 })
      if (dbPins && dbPins.length > 0) {
        const formatted = dbPins.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          image: p.image_url,
          aspectRatio: p.aspect_ratio || 'medium',
          category: p.category || 'all',
          tags: p.tags || [],
          destinationUrl: p.destination_url || '',
          author: {
            id: p.profiles?.id || p.user_id,
            name: p.profiles?.full_name || p.profiles?.username || 'Creator',
            handle: p.profiles?.username || 'creator',
            avatar: p.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            followers: '1.2k',
            isFollowed: false
          },
          likesCount: 0,
          isLiked: false,
          createdAt: p.created_at,
          comments: []
        }))
        setPins(formatted)
      }
    } catch (err) {
      console.error('Error refreshing pins from Supabase:', err)
      setPinsError(err.message || 'Failed to fetch pins from database')
    } finally {
      setIsLoadingPins(false)
    }
  }, [isConfigured])

  // Sync to localStorage as backup/cache
  useEffect(() => {
    try {
      localStorage.setItem('pinspace_pins', JSON.stringify(pins))
    } catch (e) {
      console.error('Failed to sync pins to localStorage', e)
    }
  }, [pins])

  useEffect(() => {
    try {
      localStorage.setItem('pinspace_boards', JSON.stringify(boards))
    } catch (e) {
      console.error('Failed to sync boards to localStorage', e)
    }
  }, [boards])

  useEffect(() => {
    try {
      localStorage.setItem('pinspace_saved_pins', JSON.stringify(savedPinIds))
    } catch (e) {
      console.error('Failed to sync savedPinIds', e)
    }
  }, [savedPinIds])

  /**
   * If live Supabase connection is enabled, fetch pins and boards from PostgreSQL
   */
  useEffect(() => {
    if (!isConfigured) return

    let isMounted = true

    const loadLiveBackendData = async () => {
      try {
        setIsLoadingPins(true)
        const dbPins = await fetchPinsFromDb({ limit: 60 })

        if (isMounted && dbPins && dbPins.length > 0) {
          // Format DB pins to frontend format
          const formatted = dbPins.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            image: p.image_url,
            aspectRatio: p.aspect_ratio || 'medium',
            category: p.category || 'all',
            tags: p.tags || [],
            destinationUrl: p.destination_url || '',
            author: {
              id: p.profiles?.id || p.user_id,
              name: p.profiles?.full_name || p.profiles?.username || 'Creator',
              handle: p.profiles?.username || 'creator',
              avatar: p.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
              followers: '1.2k',
              isFollowed: false
            },
            likesCount: 0,
            isLiked: false,
            createdAt: p.created_at,
            comments: []
          }))
          setPins(formatted)
        }

        if (currentUser?.id) {
          const userBoards = await fetchUserBoardsFromDb(currentUser.id)
          if (isMounted && userBoards && userBoards.length > 0) {
            setBoards(userBoards)
            const allSaved = Array.from(new Set(userBoards.flatMap(b => b.pinIds || [])))
            setSavedPinIds(allSaved)
          }
        }
      } catch (err) {
        console.warn('Could not load data from Supabase backend:', err)
      } finally {
        if (isMounted) setIsLoadingPins(false)
      }
    }

    loadLiveBackendData()

    return () => {
      isMounted = false
    }
  }, [isConfigured, currentUser?.id])

  // Get specific pin by ID
  const getPin = useCallback((id) => {
    return pins.find(p => p.id === id) || null
  }, [pins])

  // Get specific board by ID
  const getBoard = useCallback((id) => {
    return boards.find(b => b.id === id) || null
  }, [boards])

  // Check if a pin is saved in any board
  const isPinSaved = useCallback((pinId) => {
    return savedPinIds.includes(pinId)
  }, [savedPinIds])

  // Get list of board IDs a pin is currently saved in
  const getBoardIdsForPin = useCallback((pinId) => {
    return boards.filter(b => b.pinIds && b.pinIds.includes(pinId)).map(b => b.id)
  }, [boards])

  // Save or unsave pin to a specific board
  const toggleSaveToBoard = async (pinId, boardId) => {
    const targetBoard = boards.find(b => b.id === boardId)
    if (!targetBoard) return

    const alreadyInBoard = targetBoard.pinIds?.includes(pinId)

    let updatedBoards
    if (alreadyInBoard) {
      // Remove from board
      updatedBoards = boards.map(b => {
        if (b.id === boardId) {
          return {
            ...b,
            pinIds: (b.pinIds || []).filter(id => id !== pinId)
          }
        }
        return b
      })
      showToast(`Removed from "${targetBoard.name}"`, 'info')

      if (isConfigured) {
        try {
          await removePinFromBoardInDb(boardId, pinId)
        } catch (e) {
          console.warn('Failed to remove pin in Supabase:', e)
        }
      }
    } else {
      // Add to board
      updatedBoards = boards.map(b => {
        if (b.id === boardId) {
          return {
            ...b,
            pinIds: [pinId, ...(b.pinIds || [])]
          }
        }
        return b
      })
      showToast(`Saved to "${targetBoard.name}"!`, 'success')

      if (isConfigured) {
        try {
          await savePinToBoardInDb(boardId, pinId)
        } catch (e) {
          console.warn('Failed to save pin in Supabase:', e)
        }
      }
    }

    setBoards(updatedBoards)

    // Recalculate savedPinIds
    const allSaved = Array.from(new Set(updatedBoards.flatMap(b => b.pinIds || [])))
    setSavedPinIds(allSaved)
  }

  // Quick save to primary or default board
  const quickSavePin = (pinId, boardId = null) => {
    const targetBoard = boardId ? boards.find(b => b.id === boardId) : boards[0]
    if (!targetBoard) return

    toggleSaveToBoard(pinId, targetBoard.id)
  }

  // Create new Pin
  const createPin = async (pinData) => {
    const newId = `pin-${Date.now()}`
    const newPin = {
      id: newId,
      title: pinData.title || 'Untitled Pin',
      description: pinData.description || '',
      image: pinData.image,
      aspectRatio: pinData.aspectRatio || 'medium',
      category: pinData.category || 'all',
      tags: pinData.tags || [],
      destinationUrl: pinData.destinationUrl || '',
      author: {
        id: currentUser?.id || 'anonymous',
        name: currentUser?.name || 'PinSpace Curator',
        handle: currentUser?.handle ? currentUser.handle.replace('@', '') : 'curator',
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        followers: '1.4k',
        isFollowed: false
      },
      likesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
      comments: []
    }

    // Call Supabase if live
    if (isConfigured && currentUser?.id) {
      try {
        const createdDbPin = await createPinInDb({
          user_id: currentUser.id,
          title: newPin.title,
          description: newPin.description,
          image_url: newPin.image,
          destination_url: newPin.destinationUrl,
          aspect_ratio: newPin.aspectRatio,
          category: newPin.category,
          tags: newPin.tags
        })

        if (createdDbPin) {
          newPin.id = createdDbPin.id
          if (pinData.boardId) {
            await savePinToBoardInDb(pinData.boardId, createdDbPin.id)
          }
        }
      } catch (err) {
        console.warn('Failed to insert pin into Supabase:', err)
      }
    }

    setPins(prev => [newPin, ...prev])

    // If a board was specified, save to it
    if (pinData.boardId) {
      setBoards(prev => prev.map(b => {
        if (b.id === pinData.boardId) {
          return {
            ...b,
            pinIds: [newPin.id, ...(b.pinIds || [])],
            coverImage: b.coverImage || pinData.image
          }
        }
        return b
      }))
      setSavedPinIds(prev => Array.from(new Set([newPin.id, ...prev])))
    }

    showToast('Your Pin was published!', 'success')
    return newPin
  }

  // Delete Pin
  const deletePin = async (pinId) => {
    setPins(prev => prev.filter(p => p.id !== pinId))
    setBoards(prev => prev.map(b => ({
      ...b,
      pinIds: (b.pinIds || []).filter(id => id !== pinId)
    })))
    setSavedPinIds(prev => prev.filter(id => id !== pinId))

    if (isConfigured) {
      try {
        await deletePinInDb(pinId)
      } catch (err) {
        console.warn('Failed to delete pin from Supabase:', err)
      }
    }

    showToast('Pin was deleted', 'info')
  }

  // Create new Board
  const createBoard = async ({ name, description = '', isPrivate = false, initialPinId = null }) => {
    let boardId = `board-${Date.now()}`

    if (isConfigured && currentUser?.id) {
      try {
        const dbBoard = await createBoardInDb({
          user_id: currentUser.id,
          name: name.trim(),
          description: description.trim(),
          is_private: Boolean(isPrivate)
        })
        if (dbBoard) {
          boardId = dbBoard.id
          if (initialPinId) {
            await savePinToBoardInDb(boardId, initialPinId)
          }
        }
      } catch (err) {
        console.warn('Failed to create board in Supabase:', err)
      }
    }

    const newBoard = {
      id: boardId,
      name: name.trim(),
      description: description.trim(),
      coverImage: initialPinId ? getPin(initialPinId)?.image : null,
      isPrivate: Boolean(isPrivate),
      createdAt: new Date().toISOString(),
      pinIds: initialPinId ? [initialPinId] : []
    }

    setBoards(prev => [newBoard, ...prev])
    if (initialPinId) {
      setSavedPinIds(prev => Array.from(new Set([initialPinId, ...prev])))
    }
    showToast(`Board "${newBoard.name}" created!`, 'success')
    return newBoard
  }

  // Delete Board
  const deleteBoard = async (boardId) => {
    const targetBoard = boards.find(b => b.id === boardId)
    setBoards(prev => prev.filter(b => b.id !== boardId))
    const remainingBoards = boards.filter(b => b.id !== boardId)
    const allSaved = Array.from(new Set(remainingBoards.flatMap(b => b.pinIds || [])))
    setSavedPinIds(allSaved)

    if (isConfigured) {
      try {
        await deleteBoardInDb(boardId)
      } catch (err) {
        console.warn('Failed to delete board in Supabase:', err)
      }
    }

    showToast(`Board "${targetBoard?.name || 'Board'}" deleted`, 'info')
  }

  // Update Board
  const updateBoard = async (boardId, updates) => {
    if (isConfigured) {
      try {
        await updateBoardInDb(boardId, updates)
      } catch (err) {
        console.warn('Failed to update board in Supabase:', err)
        throw err
      }
    }

    setBoards(prev => prev.map(b => {
      if (b.id === boardId) {
        return {
          ...b,
          name: updates.name !== undefined ? updates.name : b.name,
          description: updates.description !== undefined ? updates.description : b.description,
          isPrivate: updates.is_private !== undefined ? Boolean(updates.is_private) : (updates.isPrivate !== undefined ? Boolean(updates.isPrivate) : b.isPrivate)
        }
      }
      return b
    }))

    showToast('Board updated successfully', 'success')
  }

  // Like pin toggle
  const toggleLikePin = (pinId) => {
    setPins(prev => prev.map(pin => {
      if (pin.id === pinId) {
        const isLiked = !pin.isLiked
        const likesCount = isLiked ? (pin.likesCount || 0) + 1 : Math.max(0, (pin.likesCount || 1) - 1)
        return { ...pin, isLiked, likesCount }
      }
      return pin
    }))
  }

  // Follow/unfollow author
  const toggleFollowAuthor = (authorHandle) => {
    let nowFollowing = false
    setPins(prev => prev.map(pin => {
      if (pin.author?.handle === authorHandle) {
        nowFollowing = !pin.author.isFollowed
        return {
          ...pin,
          author: {
            ...pin.author,
            isFollowed: nowFollowing
          }
        }
      }
      return pin
    }))
    showToast(nowFollowing ? `Following @${authorHandle}` : `Unfollowed @${authorHandle}`, 'info')
  }

  // Add comment to pin
  const addComment = (pinId, commentText) => {
    if (!commentText.trim()) return

    const newComment = {
      id: `c-${Date.now()}`,
      user: currentUser?.name || 'Aria Sterling',
      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      text: commentText.trim(),
      time: 'Just now'
    }

    setPins(prev => prev.map(pin => {
      if (pin.id === pinId) {
        return {
          ...pin,
          comments: [newComment, ...(pin.comments || [])]
        }
      }
      return pin
    }))
    showToast('Comment posted!', 'success')
  }

  // Related pins for a given pin
  const getRelatedPins = (pinId, limit = 12) => {
    const targetPin = pins.find(p => p.id === pinId)
    if (!targetPin) return pins.slice(0, limit)

    const related = pins.filter(p => {
      if (p.id === pinId) return false
      if (p.category === targetPin.category) return true
      if (p.tags && targetPin.tags && p.tags.some(t => targetPin.tags.includes(t))) return true
      return false
    })

    if (related.length < limit) {
      const rest = pins.filter(p => p.id !== pinId && !related.includes(p))
      return [...related, ...rest].slice(0, limit)
    }

    return related.slice(0, limit)
  }

  // Filtered pins based on search query and category
  const filteredPins = useMemo(() => {
    let result = pins

    if (activeCategory && activeCategory !== 'all') {
      result = result.filter(pin => pin.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(pin => {
        const titleMatch = pin.title?.toLowerCase().includes(query)
        const descMatch = pin.description?.toLowerCase().includes(query)
        const tagMatch = pin.tags?.some(tag => tag.toLowerCase().includes(query))
        const authorMatch = pin.author?.name?.toLowerCase().includes(query) || pin.author?.handle?.toLowerCase().includes(query)
        return titleMatch || descMatch || tagMatch || authorMatch
      })
    }

    return result
  }, [pins, activeCategory, searchQuery])

  return (
    <PinContext.Provider
      value={{
        pins,
        boards,
        savedPinIds,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        isLoadingPins,
        filteredPins,
        getPin,
        getBoard,
        isPinSaved,
        getBoardIdsForPin,
        toggleSaveToBoard,
        quickSavePin,
        createPin,
        deletePin,
        createBoard,
        updateBoard,
        deleteBoard,
        refreshPins,
        pinsError,
        toggleLikePin,
        toggleFollowAuthor,
        addComment,
        getRelatedPins
      }}
    >
      {children}
    </PinContext.Provider>
  )
}

export function usePins() {
  const context = useContext(PinContext)
  if (!context) {
    throw new Error('usePins must be used within a PinProvider')
  }
  return context
}
