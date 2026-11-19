import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  Share2,
  Heart,
  ChevronDown,
  ExternalLink,
  Check,
  Send,
  MoreHorizontal,
  Bookmark,
  Download,
  Trash2
} from 'lucide-react'
import { usePins } from '../context/PinContext'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { formatNumber } from '../lib/utils'
import { fetchPinById, fetchRelatedPins as fetchRelatedPinsFromDb } from '../services/pinService'
import { isSupabaseConfigured } from '../lib/supabase'
import SaveToBoardModal from '../components/pin/SaveToBoardModal'
import PinShareModal from '../components/pin/PinShareModal'
import MasonryGrid from '../components/pin/MasonryGrid'

export default function PinDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    getPin,
    boards,
    isPinSaved,
    quickSavePin,
    toggleSaveToBoard,
    toggleLikePin,
    toggleFollowAuthor,
    addComment,
    getRelatedPins,
    deletePin
  } = usePins()
  const { currentUser, isAuthenticated } = useAuth()
  const { showToast } = useNotification()

  const [pin, setPin] = useState(() => getPin(id))
  const [relatedPins, setRelatedPins] = useState(() => getRelatedPins(id, 12))
  const [isLoading, setIsLoading] = useState(!getPin(id))
  const [commentText, setCommentText] = useState('')
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [selectedBoardId, setSelectedBoardId] = useState('')

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      showToast('Please log in to leave a comment', 'info')
      navigate('/login', { state: { from: window.location } })
      return
    }
    if (!commentText.trim()) return
    addComment(pin.id, commentText)
    setCommentText('')
    setPin(getPin(pin.id))
  }

  const handleQuickSaveWithAuth = () => {
    if (!isAuthenticated) {
      showToast('Please log in to save pins', 'info')
      navigate('/login', { state: { from: window.location } })
      return
    }
    quickSavePin(pin.id, selectedBoardId)
  }

  const handleOpenBoardPickerWithAuth = () => {
    if (!isAuthenticated) {
      showToast('Please log in to save to a board', 'info')
      navigate('/login', { state: { from: window.location } })
      return
    }
    setIsSaveModalOpen(true)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    let isMounted = true

    const loadPinDetails = async () => {
      const localPin = getPin(id)
      if (localPin) {
        setPin(localPin)
        setRelatedPins(getRelatedPins(id, 12))
        setIsLoading(false)
        return
      }

      // If Supabase configured, fetch by ID
      if (isSupabaseConfigured()) {
        try {
          setIsLoading(true)
          const dbPin = await fetchPinById(id)
          if (isMounted && dbPin) {
            const formatted = {
              id: dbPin.id,
              title: dbPin.title,
              description: dbPin.description,
              image: dbPin.image_url,
              aspectRatio: dbPin.aspect_ratio || 'medium',
              category: dbPin.category || 'all',
              tags: dbPin.tags || [],
              destinationUrl: dbPin.destination_url || '',
              author: {
                id: dbPin.profiles?.id || dbPin.user_id,
                name: dbPin.profiles?.full_name || dbPin.profiles?.username || 'Creator',
                handle: dbPin.profiles?.username || 'creator',
                avatar: dbPin.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
                followers: '1.2k',
                isFollowed: false
              },
              likesCount: 0,
              isLiked: false,
              createdAt: dbPin.created_at,
              comments: []
            }
            setPin(formatted)

            const dbRelated = await fetchRelatedPinsFromDb(formatted.id, formatted.category, formatted.tags, 12)
            if (isMounted && dbRelated && dbRelated.length > 0) {
              setRelatedPins(dbRelated.map(p => ({
                id: p.id,
                title: p.title,
                description: p.description,
                image: p.image_url,
                aspectRatio: p.aspect_ratio || 'medium',
                category: p.category || 'all',
                tags: p.tags || [],
                author: {
                  id: p.profiles?.id || p.user_id,
                  name: p.profiles?.full_name || p.profiles?.username || 'Creator',
                  avatar: p.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                }
              })))
            }
          }
        } catch (err) {
          console.warn('Error fetching pin by id:', err)
        } finally {
          if (isMounted) setIsLoading(false)
        }
      } else {
        if (isMounted) setIsLoading(false)
      }
    }

    loadPinDetails()

    if (boards.length > 0) {
      setSelectedBoardId(boards[0].id)
    }

    return () => {
      isMounted = false
    }
  }, [id, getPin, boards, getRelatedPins])

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-pin-red border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold text-pin-gray-500">Loading pin inspiration...</p>
      </div>
    )
  }

  if (!pin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-pin-gray-900 mb-2">Pin not found</h2>
        <p className="text-sm text-pin-gray-500 mb-6">The pin you are looking for may have been removed or does not exist.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-pin-red text-white font-bold rounded-full hover:bg-pin-redHover transition-colors"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const saved = isPinSaved(pin.id)
  const isAuthor = pin.author?.id === currentUser?.id || pin.author?.handle === currentUser?.handle?.replace('@', '')

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = pin.image
    link.target = '_blank'
    link.download = `${pin.title.replace(/\s+/g, '-').toLowerCase()}.jpg`
    link.click()
    showToast('Opening image full resolution', 'info')
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this Pin?')) {
      deletePin(pin.id)
      navigate('/profile')
    }
  }

  const getDomain = (url) => {
    if (!url) return null
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  const domain = getDomain(pin.destinationUrl)

  return (
    <div className="min-h-screen pb-24 pt-4 sm:pt-6 px-3 sm:px-6 max-w-[1400px] mx-auto">
      
      {/* Top back button */}
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="p-3 rounded-full hover:bg-pin-gray-100 text-pin-gray-800 transition-colors inline-flex items-center gap-2 font-semibold text-sm"
          title="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Back</span>
        </button>
      </div>

      {/* Main Pin Card Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-pin-gray-200/80 overflow-hidden max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2">
        
        {/* Left Column: Image */}
        <div className="bg-pin-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r border-pin-gray-100">
          <div className="relative group w-full max-w-lg overflow-hidden rounded-2xl sm:rounded-3xl shadow-md">
            <img
              src={pin.image}
              alt={pin.title}
              className="w-full h-auto object-cover max-h-[75vh]"
            />
          </div>
        </div>

        {/* Right Column: Details & Interaction */}
        <div className="p-6 sm:p-8 flex flex-col justify-between">
          
          <div>
            {/* Top actions bar */}
            <div className="flex items-center justify-between gap-2 pb-6 border-b border-pin-gray-100">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-2.5 rounded-full hover:bg-pin-gray-100 text-pin-gray-700 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="p-2.5 rounded-full hover:bg-pin-gray-100 text-pin-gray-700 transition-colors"
                  title="Download Image"
                >
                  <Download className="w-5 h-5" />
                </button>

                {isAuthor && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="p-2.5 rounded-full hover:bg-rose-50 text-rose-600 transition-colors"
                    title="Delete Pin"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Board Selector & Save Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenBoardPickerWithAuth}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 bg-pin-gray-100 hover:bg-pin-gray-200 text-pin-gray-900 rounded-full text-xs font-bold transition-colors max-w-[150px] truncate"
                >
                  <span className="truncate">
                    {boards.find(b => b.id === selectedBoardId)?.name || 'Select board'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={handleQuickSaveWithAuth}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm tracking-wide shadow-sm transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                    saved
                      ? 'bg-pin-gray-900 text-white hover:bg-black'
                      : 'bg-pin-red text-white hover:bg-pin-redHover'
                  }`}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            </div>

            {/* Destination Link */}
            {pin.destinationUrl && (
              <div className="pt-4">
                <a
                  href={pin.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-pin-gray-600 hover:text-pin-red transition-colors underline decoration-pin-gray-300 underline-offset-4"
                >
                  <span>{domain || pin.destinationUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Pin Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-pin-gray-950 mt-3 leading-tight">
              {pin.title}
            </h1>

            {/* Pin Description */}
            {pin.description && (
              <p className="text-sm sm:text-base text-pin-gray-700 mt-3 leading-relaxed">
                {pin.description}
              </p>
            )}

            {/* Tags */}
            {pin.tags && pin.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {pin.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-pin-gray-100 hover:bg-pin-gray-200 text-xs font-medium text-pin-gray-700 rounded-full transition-colors cursor-pointer"
                    onClick={() => navigate(`/explore`)}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Creator Row */}
            <div className="mt-6 pt-6 border-t border-pin-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={pin.author?.avatar}
                  alt={pin.author?.name}
                  className="w-12 h-12 rounded-full object-cover border border-pin-gray-200 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-sm text-pin-gray-900 leading-snug">
                    {pin.author?.name}
                  </h4>
                  <p className="text-xs text-pin-gray-500">
                    {pin.author?.followers} followers
                  </p>
                </div>
              </div>

              {!isAuthor && (
                <button
                  type="button"
                  onClick={() => toggleFollowAuthor(pin.author?.handle)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    pin.author?.isFollowed
                      ? 'bg-pin-gray-900 text-white hover:bg-pin-gray-800'
                      : 'bg-pin-gray-100 hover:bg-pin-gray-200 text-pin-gray-800'
                  }`}
                >
                  {pin.author?.isFollowed ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            {/* Like count & reaction */}
            <div className="mt-4 flex items-center gap-3 text-sm text-pin-gray-600">
              <button
                type="button"
                onClick={() => toggleLikePin(pin.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors ${
                  pin.isLiked
                    ? 'border-pin-red bg-pin-lightRed/50 text-pin-red'
                    : 'border-pin-gray-200 hover:bg-pin-gray-50 text-pin-gray-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${pin.isLiked ? 'fill-pin-red' : ''}`} />
                <span className="font-bold text-xs">{formatNumber(pin.likesCount)}</span>
              </button>
              <span className="text-xs text-pin-gray-400">
                {pin.likesCount === 1 ? 'person loves this' : 'people love this'}
              </span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8 pt-6 border-t border-pin-gray-100">
            <h4 className="font-bold text-base text-pin-gray-900 mb-4">
              Comments ({pin.comments?.length || 0})
            </h4>

            {/* Comment list */}
            <div className="max-h-48 overflow-y-auto space-y-3 pr-2 mb-4">
              {pin.comments && pin.comments.length > 0 ? (
                pin.comments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3">
                    <img
                      src={c.avatar}
                      alt={c.user}
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="bg-pin-gray-50 rounded-2xl p-3 flex-1 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-pin-gray-900">{c.user}</span>
                        <span className="text-pin-gray-400 text-[10px]">{c.time}</span>
                      </div>
                      <p className="text-pin-gray-700 leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-pin-gray-400 py-2">
                  No comments yet. Be the first to share your feedback or ask a question!
                </p>
              )}
            </div>

            {/* Add comment input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 flex items-center bg-pin-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-pin-lightRed focus-within:bg-white border border-transparent focus-within:border-pin-red transition-all">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs text-pin-gray-900 placeholder:text-pin-gray-400 font-medium"
                />
                {commentText.trim() && (
                  <button
                    type="submit"
                    className="p-1 rounded-full text-pin-red hover:bg-pin-lightRed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* Related Pins Section */}
      <section className="mt-16">
        <h2 className="text-xl sm:text-2xl font-bold text-center text-pin-gray-950 mb-8">
          More like this
        </h2>
        <MasonryGrid pins={relatedPins} />
      </section>

      {/* Modals */}
      <SaveToBoardModal
        pin={pin}
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
      />

      <PinShareModal
        pin={pin}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

    </div>
  )
}
