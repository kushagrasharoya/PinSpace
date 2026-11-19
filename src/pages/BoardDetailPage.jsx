import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Lock, Globe, Trash2, Share2, Plus, Edit3, Loader2 } from 'lucide-react'
import { usePins } from '../context/PinContext'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { fetchBoardPins, fetchBoardById } from '../services/boardService'
import { isSupabaseConfigured } from '../lib/supabase'
import MasonryGrid from '../components/pin/MasonryGrid'
import EditBoardModal from '../components/board/EditBoardModal'

export default function BoardDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBoard, pins, deleteBoard } = usePins()
  const { currentUser } = useAuth()
  const { showToast } = useNotification()

  const [board, setBoard] = useState(() => getBoard(id))
  const [boardPins, setBoardPins] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const isConfigured = isSupabaseConfigured()

  useEffect(() => {
    let isMounted = true

    const loadBoardData = async () => {
      setIsLoading(true)

      const localBoard = getBoard(id)
      if (localBoard) {
        setBoard(localBoard)
        const localPins = (localBoard.pinIds || [])
          .map(pinId => pins.find(p => p.id === pinId))
          .filter(Boolean)
        setBoardPins(localPins)
      }

      // If Supabase live, fetch from database
      if (isConfigured) {
        try {
          const dbBoard = await fetchBoardById(id)
          if (isMounted && dbBoard) {
            setBoard({
              id: dbBoard.id,
              name: dbBoard.name,
              description: dbBoard.description,
              isPrivate: dbBoard.is_private,
              userId: dbBoard.user_id,
              createdAt: dbBoard.created_at
            })
          }

          const dbBoardPins = await fetchBoardPins(id)
          if (isMounted && dbBoardPins) {
            const formatted = dbBoardPins.map(p => ({
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
            if (formatted.length > 0) {
              setBoardPins(formatted)
            }
          }
        } catch (err) {
          console.warn('Error fetching board from Supabase:', err)
        }
      }

      if (isMounted) setIsLoading(false)
    }

    loadBoardData()

    return () => {
      isMounted = false
    }
  }, [id, getBoard, pins, isConfigured])

  if (!isLoading && !board) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-pin-gray-900 mb-2">Board not found</h2>
        <p className="text-sm text-pin-gray-500 mb-6">This board might have been removed or renamed.</p>
        <button
          onClick={() => navigate('/profile')}
          className="px-6 py-2.5 bg-pin-red text-white font-bold rounded-full hover:bg-pin-redHover transition-colors"
        >
          Back to Profile
        </button>
      </div>
    )
  }

  const handleDeleteBoard = () => {
    if (window.confirm(`Are you sure you want to delete board "${board.name}"? Pins inside it will remain in other boards.`)) {
      deleteBoard(board.id)
      navigate('/profile')
    }
  }

  const handleShareBoard = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('Board link copied to clipboard!', 'success')
  }

  return (
    <div className="min-h-screen pb-24 pt-4 sm:pt-6 px-4 sm:px-6 max-w-[1920px] mx-auto">
      
      {/* Top back & actions */}
      <div className="max-w-4xl mx-auto flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-full hover:bg-pin-gray-100 text-pin-gray-800 transition-colors inline-flex items-center gap-2 font-semibold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="p-2.5 rounded-full hover:bg-pin-gray-100 text-pin-gray-700 transition-colors"
            title="Edit board"
          >
            <Edit3 className="w-5 h-5" />
          </button>

          <button
            onClick={handleShareBoard}
            className="p-2.5 rounded-full hover:bg-pin-gray-100 text-pin-gray-700 transition-colors"
            title="Share board"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            onClick={handleDeleteBoard}
            className="p-2.5 rounded-full hover:bg-rose-50 text-rose-600 transition-colors"
            title="Delete board"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Board Header Details */}
      {board && (
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-pin-gray-950 tracking-tight">
              {board.name}
            </h1>
            {board.isPrivate && (
              <span title="Secret board">
                <Lock className="w-5 h-5 text-pin-gray-400 shrink-0" />
              </span>
            )}
          </div>

          {board.description && (
            <p className="text-sm sm:text-base text-pin-gray-600 max-w-lg mx-auto">
              {board.description}
            </p>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={currentUser?.name || 'Owner'}
              className="w-7 h-7 rounded-full object-cover border border-pin-gray-200"
            />
            <span className="text-xs font-semibold text-pin-gray-700">{currentUser?.name || 'Curator'}</span>
            <span className="text-pin-gray-300">•</span>
            <span className="text-xs font-medium text-pin-gray-500">
              {boardPins.length} {boardPins.length === 1 ? 'Pin' : 'Pins'}
            </span>
          </div>
        </div>
      )}

      {/* Board Pins Feed */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-pin-red" />
        </div>
      ) : boardPins.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 px-4">
          <div className="w-16 h-16 bg-pin-gray-100 text-pin-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-pin-gray-900 mb-1">There aren't any Pins on this board yet</h3>
          <p className="text-xs text-pin-gray-500 mb-6">
            Find ideas on your home feed or explore trending collections and save them here.
          </p>
          <Link
            to="/explore"
            className="px-6 py-2.5 bg-pin-red text-white text-sm font-bold rounded-full hover:bg-pin-redHover transition-colors inline-block"
          >
            Find ideas to save
          </Link>
        </div>
      ) : (
        <MasonryGrid pins={boardPins} />
      )}

      {board && (
        <EditBoardModal
          board={board}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

    </div>
  )
}
