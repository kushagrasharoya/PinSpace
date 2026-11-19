import React, { useState, useEffect } from 'react'
import {
  Share2,
  SlidersHorizontal,
  Plus,
  Lock,
  Globe,
  ExternalLink,
  FolderHeart,
  Grid3X3,
  Bookmark,
  Loader2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { usePins } from '../context/PinContext'
import { useNotification } from '../context/NotificationContext'
import { fetchPins } from '../services/pinService'
import { fetchUserBoards } from '../services/boardService'
import { isSupabaseConfigured } from '../lib/supabase'
import BoardCard from '../components/board/BoardCard'
import MasonryGrid from '../components/pin/MasonryGrid'
import EditProfileModal from '../components/profile/EditProfileModal'
import CreateBoardModal from '../components/board/CreateBoardModal'

export default function ProfilePage() {
  const { currentUser } = useAuth()
  const { pins, boards, savedPinIds } = usePins()
  const { showToast } = useNotification()

  const [activeTab, setActiveTab] = useState('boards') // 'boards' | 'created' | 'saved'
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false)
  const [dbCreatedPins, setDbCreatedPins] = useState([])
  const [isLoadingCreated, setIsLoadingCreated] = useState(false)

  const isConfigured = isSupabaseConfigured()

  // Created pins by this user from local state
  const localCreatedPins = pins.filter(p =>
    (currentUser?.id && p.author?.id === currentUser.id) ||
    (currentUser?.handle && p.author?.handle === currentUser.handle.replace('@', '')) ||
    (currentUser?.id && p.user_id === currentUser.id)
  )

  // Fetch created pins from Supabase if configured
  useEffect(() => {
    if (!isConfigured || !currentUser?.id) return

    let isMounted = true
    const loadUserCreatedPins = async () => {
      try {
        setIsLoadingCreated(true)
        const userPins = await fetchPins({ userId: currentUser.id })
        if (isMounted && userPins && userPins.length > 0) {
          const formatted = userPins.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            image: p.image_url,
            aspectRatio: p.aspect_ratio || 'medium',
            category: p.category || 'all',
            tags: p.tags || [],
            destinationUrl: p.destination_url || '',
            author: {
              id: currentUser.id,
              name: currentUser.name,
              handle: currentUser.handle ? currentUser.handle.replace('@', '') : 'user',
              avatar: currentUser.avatar
            },
            likesCount: 0,
            isLiked: false,
            createdAt: p.created_at,
            comments: []
          }))
          setDbCreatedPins(formatted)
        }
      } catch (err) {
        console.warn('Could not fetch user pins from database:', err)
      } finally {
        if (isMounted) setIsLoadingCreated(false)
      }
    }

    loadUserCreatedPins()

    return () => {
      isMounted = false
    }
  }, [isConfigured, currentUser?.id])

  const createdPins = dbCreatedPins.length > 0 ? dbCreatedPins : localCreatedPins

  // Saved pins
  const savedPins = pins.filter(p => savedPinIds.includes(p.id))

  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast('Profile link copied to clipboard!', 'success')
  }

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-7xl mx-auto">
      
      {/* Profile Header */}
      <div className="text-center max-w-xl mx-auto space-y-4">
        
        {/* Avatar */}
        <div className="relative inline-block">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
            alt={currentUser?.name || 'User'}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover mx-auto border-4 border-white shadow-xl ring-2 ring-pin-gray-200"
          />
        </div>

        {/* User Info */}
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-pin-gray-950 tracking-tight">
            {currentUser?.name || 'PinSpace User'}
          </h1>
          <p className="text-sm font-semibold text-pin-gray-500 mt-1">
            {currentUser?.handle || '@user'}
          </p>
        </div>

        {/* Bio */}
        {currentUser?.bio && (
          <p className="text-sm text-pin-gray-700 leading-relaxed max-w-md mx-auto">
            {currentUser?.bio}
          </p>
        )}

        {/* Website */}
        {currentUser?.website && (
          <a
            href={currentUser?.website.startsWith('http') ? currentUser.website : `https://${currentUser.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-pin-red hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{currentUser?.website.replace(/^https?:\/\//, '')}</span>
          </a>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 pt-1 text-sm font-semibold text-pin-gray-800">
          <div>
            <span className="font-bold text-pin-gray-950">{currentUser?.followersCount || 1420}</span>{' '}
            <span className="text-pin-gray-500 font-normal">followers</span>
          </div>
          <div className="w-1 h-1 bg-pin-gray-300 rounded-full" />
          <div>
            <span className="font-bold text-pin-gray-950">{currentUser?.followingCount || 388}</span>{' '}
            <span className="text-pin-gray-500 font-normal">following</span>
          </div>
        </div>

        {/* Profile Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={handleShareProfile}
            className="p-3 bg-pin-gray-100 hover:bg-pin-gray-200 text-pin-gray-800 rounded-full transition-colors"
            title="Share Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsEditProfileOpen(true)}
            className="px-5 py-2.5 bg-pin-gray-100 hover:bg-pin-gray-200 text-pin-gray-800 rounded-full font-bold text-sm transition-colors"
          >
            Edit profile
          </button>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="mt-12 border-b border-pin-gray-200 flex items-center justify-center gap-8">
        <button
          onClick={() => setActiveTab('boards')}
          className={`pb-4 px-2 font-bold text-sm sm:text-base transition-all relative ${
            activeTab === 'boards'
              ? 'text-pin-gray-950'
              : 'text-pin-gray-500 hover:text-pin-gray-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <FolderHeart className="w-4 h-4" />
            <span>Saved Boards ({boards.length})</span>
          </div>
          {activeTab === 'boards' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-pin-red rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('created')}
          className={`pb-4 px-2 font-bold text-sm sm:text-base transition-all relative ${
            activeTab === 'created'
              ? 'text-pin-gray-950'
              : 'text-pin-gray-500 hover:text-pin-gray-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-4 h-4" />
            <span>Created ({createdPins.length})</span>
          </div>
          {activeTab === 'created' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-pin-red rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`pb-4 px-2 font-bold text-sm sm:text-base transition-all relative ${
            activeTab === 'saved'
              ? 'text-pin-gray-950'
              : 'text-pin-gray-500 hover:text-pin-gray-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            <span>All Pins ({savedPins.length})</span>
          </div>
          {activeTab === 'saved' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-pin-red rounded-full" />
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        
        {/* Boards View */}
        {activeTab === 'boards' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-pin-gray-900">Your Boards</h2>
              <button
                onClick={() => setIsCreateBoardOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-pin-red hover:bg-pin-redHover text-white text-xs font-bold rounded-full transition-transform active:scale-95 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Create Board</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              
              {/* Quick Create Board Card */}
              <div
                onClick={() => setIsCreateBoardOpen(true)}
                className="group aspect-[4/3] rounded-3xl border-2 border-dashed border-pin-gray-300 hover:border-pin-red bg-pin-gray-50/60 hover:bg-pin-lightRed/20 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-pin-red group-hover:scale-110 transition-transform mb-2">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-pin-gray-800 group-hover:text-pin-red transition-colors">
                  Create Board
                </span>
                <span className="text-xs text-pin-gray-400 mt-0.5">Organize ideas</span>
              </div>

              {boards.map((board) => (
                <BoardCard key={board.id} board={board} />
              ))}
            </div>
          </div>
        )}

        {/* Created Pins View */}
        {activeTab === 'created' && (
          <div>
            {isLoadingCreated ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-pin-red" />
              </div>
            ) : createdPins.length === 0 ? (
              <div className="text-center py-16 max-w-sm mx-auto">
                <div className="w-16 h-16 bg-pin-lightRed text-pin-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-pin-gray-900 mb-1">Nothing created yet</h3>
                <p className="text-xs text-pin-gray-500 mb-6">
                  Share your photography, architectural moodboards, or 3D renders with the community.
                </p>
                <a
                  href="/create"
                  className="px-6 py-2.5 bg-pin-red text-white text-sm font-bold rounded-full hover:bg-pin-redHover transition-colors inline-block"
                >
                  Create Pin
                </a>
              </div>
            ) : (
              <MasonryGrid pins={createdPins} />
            )}
          </div>
        )}

        {/* All Saved Pins View */}
        {activeTab === 'saved' && (
          <div>
            {savedPins.length === 0 ? (
              <div className="text-center py-16 max-w-sm mx-auto">
                <p className="text-sm text-pin-gray-500 mb-4">You haven't saved any Pins yet.</p>
                <a
                  href="/explore"
                  className="px-6 py-2.5 bg-pin-red text-white text-sm font-bold rounded-full hover:bg-pin-redHover transition-colors inline-block"
                >
                  Explore inspirations
                </a>
              </div>
            ) : (
              <MasonryGrid pins={savedPins} />
            )}
          </div>
        )}

      </div>

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

      <CreateBoardModal
        isOpen={isCreateBoardOpen}
        onClose={() => setIsCreateBoardOpen(false)}
      />

    </div>
  )
}
