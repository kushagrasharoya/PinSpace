import React, { useState } from 'react'
import { X, Copy, Check, Share2, Send, Bookmark, ExternalLink } from 'lucide-react'
import { useNotification } from '../../context/NotificationContext'

export default function PinShareModal({ pin, isOpen, onClose }) {
  const { showToast } = useNotification()
  const [copied, setCopied] = useState(false)

  if (!isOpen || !pin) return null

  const shareUrl = `${window.location.origin}/pin/${pin.id}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    showToast('Link copied to clipboard!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-pin-gray-100 overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-pin-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-pin-gray-900">Share this Pin</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-pin-gray-100 text-pin-gray-500 hover:text-pin-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pin summary */}
        <div className="p-6">
          <div className="flex items-center gap-3.5 mb-6 p-3 rounded-2xl bg-pin-gray-50 border border-pin-gray-100">
            <img
              src={pin.image}
              alt={pin.title}
              className="w-14 h-14 rounded-2xl object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-semibold text-sm text-pin-gray-900 line-clamp-1">{pin.title}</h4>
              <p className="text-xs text-pin-gray-500">{pin.author?.name}</p>
            </div>
          </div>

          {/* Social share options */}
          <div className="grid grid-cols-4 gap-3 mb-6 text-center">
            <button
              onClick={() => {
                window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(pin.title + ' ' + shareUrl)}`, '_blank')
              }}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Send className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-pin-gray-700">WhatsApp</span>
            </button>

            <button
              onClick={() => {
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(pin.title)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
              }}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-pin-gray-700">X (Twitter)</span>
            </button>

            <button
              onClick={() => {
                window.open(`mailto:?subject=${encodeURIComponent(pin.title)}&body=${encodeURIComponent(shareUrl)}`, '_blank')
              }}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-pin-gray-800 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                <Bookmark className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-pin-gray-700">Email</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm ${
                copied ? 'bg-emerald-600 text-white' : 'bg-pin-gray-100 text-pin-gray-800'
              }`}>
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </div>
              <span className="text-xs font-medium text-pin-gray-700">{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>

          {/* Copy link input box */}
          <div className="flex items-center gap-2 p-2 bg-pin-gray-100 rounded-2xl border border-pin-gray-200">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent border-none outline-none text-xs text-pin-gray-700 px-2 font-mono truncate"
            />
            <button
              onClick={handleCopyLink}
              className="shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold bg-pin-gray-900 hover:bg-pin-gray-800 text-white transition-colors"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
