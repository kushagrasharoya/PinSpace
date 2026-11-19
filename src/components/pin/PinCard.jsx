import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Heart,
  Share2,
  ExternalLink,
  ChevronDown,
  Check,
  MoreHorizontal,
  Bookmark
} from 'lucide-react'
import { usePins } from '../../context/PinContext'
import { useAuth } from '../../context/AuthContext'
import { formatNumber } from '../../lib/utils'
import SaveToBoardModal from './SaveToBoardModal'
import PinShareModal from './PinShareModal'

export default function PinCard({ pin }) {
  const navigate = useNavigate()
  const { boards, isPinSaved, quickSavePin, toggleLikePin } = usePins()
  const { isAuthenticated } = useAuth()

  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const saved = isPinSaved(pin.id)
  const defaultBoard = boards[0]

  // Clean domain extraction
  const getDomain = (url) => {
    if (!url) return null
    try {
      const hostname = new URL(url).hostname
      return hostname.replace('www.', '')
    } catch {
      return url.replace(/^https?:\/\//, '').split('/')[0]
    }
  }

  const domain = getDomain(pin.destinationUrl)

  const handleCardClick = (e) => {
    // If click was on interactive child, don't navigate
    if (e.target.closest('button') || e.target.closest('a')) {
      return
    }
    navigate(`/pin/${pin.id}`)
  }

  const handleQuickSave = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    quickSavePin(pin.id)
  }

  const handleLike = (e) => {
    e.stopPropagation()
    toggleLikePin(pin.id)
  }

  const handleOpenBoardPicker = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setIsSaveModalOpen(true)
  }

  const handleOpenShare = (e) => {
    e.stopPropagation()
    setIsShareModalOpen(true)
  }

  // Fallback image in case Unsplash ID fails or network glitch
  const fallbackImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'

  return (
    <>
      <div
        className="group relative mb-4 sm:mb-6 break-inside-avoid cursor-zoom-in"
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Image Container */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-pin-gray-100 shadow-sm transition-all duration-300 group-hover:shadow-pin-hover">
          
          {/* Skeleton Shimmer when loading */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-pin-gray-200 animate-pulse min-h-[220px]" />
          )}

          <img
            src={imageError ? fallbackImage : pin.image}
            alt={pin.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true)
              setImageLoaded(true)
            }}
            className={`w-full object-cover transition-all duration-300 transform group-hover:scale-[1.02] ${
              imageLoaded ? 'opacity-100' : 'opacity-0 min-h-[220px]'
            }`}
          />

          {/* Dark Overlay on Hover */}
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-200 flex flex-col justify-between p-3.5 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Top Bar: Board Picker & Save Button */}
            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleOpenBoardPicker}
                className="max-w-[140px] flex items-center gap-1 px-3 py-2 bg-white/90 hover:bg-white text-pin-gray-900 rounded-full text-xs font-bold backdrop-blur-md shadow-sm truncate transition-colors"
                title="Select board to save"
              >
                <span className="truncate">{defaultBoard?.name || 'Save'}</span>
                <ChevronDown className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                type="button"
                onClick={handleQuickSave}
                className={`px-4 py-2.5 rounded-full font-bold text-xs tracking-wide shadow-md transition-all duration-200 active:scale-95 flex items-center gap-1.5 ${
                  saved
                    ? 'bg-pin-gray-900 hover:bg-black text-white'
                    : 'bg-pin-red hover:bg-pin-redHover text-white'
                }`}
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>

            {/* Bottom Bar: External Link & Quick Actions */}
            <div className="flex items-center justify-between gap-2">
              {domain ? (
                <a
                  href={pin.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-pin-gray-900 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm transition-colors max-w-[150px] truncate"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  <span className="truncate">{domain}</span>
                </a>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleLike}
                  className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 ${
                    pin.isLiked
                      ? 'bg-pin-red text-white'
                      : 'bg-white/90 hover:bg-white text-pin-gray-800'
                  }`}
                  title={pin.isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-3.5 h-3.5 ${pin.isLiked ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={handleOpenShare}
                  className="p-2 bg-white/90 hover:bg-white text-pin-gray-800 rounded-full backdrop-blur-md transition-colors"
                  title="Share"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pin Details Below Image */}
        <div className="mt-2.5 px-1">
          <h3 className="font-semibold text-sm text-pin-gray-900 leading-snug line-clamp-2 hover:text-pin-gray-700 transition-colors">
            {pin.title}
          </h3>

          <div className="mt-1.5 flex items-center justify-between text-xs text-pin-gray-500">
            <div className="flex items-center gap-2 min-w-0">
              <img
                src={pin.author?.avatar}
                alt={pin.author?.name}
                className="w-5 h-5 rounded-full object-cover shrink-0"
              />
              <span className="truncate font-medium text-pin-gray-700 hover:text-pin-gray-900">
                {pin.author?.name}
              </span>
            </div>

            {pin.likesCount > 0 && (
              <div className="flex items-center gap-1 text-pin-gray-400 shrink-0 text-[11px]">
                <Heart className={`w-3 h-3 ${pin.isLiked ? 'text-pin-red fill-pin-red' : ''}`} />
                <span>{formatNumber(pin.likesCount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

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
    </>
  )
}
