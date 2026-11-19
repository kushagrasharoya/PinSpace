import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload,
  Link as LinkIcon,
  X,
  ChevronDown,
  Sparkles,
  Image as ImageIcon,
  Check,
  Loader2
} from 'lucide-react'
import { usePins } from '../context/PinContext'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { CATEGORIES } from '../data/mockCategories'
import { uploadPinImage } from '../services/storageService'
import { isSupabaseConfigured } from '../lib/supabase'
import CreateBoardModal from '../components/board/CreateBoardModal'

export default function CreatePinPage() {
  const navigate = useNavigate()
  const { boards, createPin } = usePins()
  const { currentUser, user } = useAuth()
  const { showToast } = useNotification()

  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [destinationUrl, setDestinationUrl] = useState('')
  const [category, setCategory] = useState('design')
  const [selectedBoardId, setSelectedBoardId] = useState(boards[0]?.id || '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState(['aesthetic', 'inspiration'])
  const [aspectRatio, setAspectRatio] = useState('tall')
  const [isCreateBoardModalOpen, setIsCreateBoardModalOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Sample quick inspiration images
  const sampleInspirationUrls = [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
  ]

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result)
        setImageUrl('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlChange = (val) => {
    setSelectedFile(null)
    setImageUrl(val)
    setImagePreview(val)
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const clean = tagInput.trim().replace(/^#/, '').toLowerCase()
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean])
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!imagePreview || !title.trim()) return

    let finalImageUrl = imagePreview

    // If an actual image file was uploaded and Supabase is configured, upload to storage bucket
    if (selectedFile && isSupabaseConfigured() && user?.id) {
      try {
        setIsUploading(true)
        const storageResult = await uploadPinImage(selectedFile, user.id)
        if (storageResult?.publicUrl) {
          finalImageUrl = storageResult.publicUrl
        }
      } catch (uploadErr) {
        console.warn('Storage upload warning (using preview URL):', uploadErr)
        showToast(uploadErr.message || 'Image storage upload warning', 'warning')
      } finally {
        setIsUploading(false)
      }
    }

    try {
      const newPin = await createPin({
        title: title.trim(),
        description: description.trim(),
        image: finalImageUrl,
        destinationUrl: destinationUrl.trim(),
        category,
        tags,
        aspectRatio,
        boardId: selectedBoardId
      })

      if (newPin?.id) {
        navigate(`/pin/${newPin.id}`)
      } else {
        navigate('/')
      }
    } catch (err) {
      showToast(err.message || 'Failed to create pin', 'warning')
    }
  }

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 sm:px-6 max-w-5xl mx-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-6 border-b border-pin-gray-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-pin-gray-950">
          Create Pin
        </h1>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={isUploading}
            className="px-5 py-2.5 rounded-full font-bold text-sm text-pin-gray-600 hover:bg-pin-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!imagePreview || !title.trim() || isUploading}
            className="px-6 py-2.5 rounded-full font-bold text-sm bg-pin-red hover:bg-pin-redHover text-white shadow-sm disabled:opacity-40 transition-all active:scale-95 flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing...</span>
              </>
            ) : (
              <span>Publish</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Creation Form Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-pin-gray-200/80 p-6 sm:p-10 mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Image Upload & Preview (5 cols) */}
        <div className="md:col-span-5 flex flex-col">
          <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-2">
            Pin Image
          </label>

          {imagePreview ? (
            <div className="relative group rounded-3xl overflow-hidden bg-pin-gray-100 border border-pin-gray-200 shadow-sm max-h-[500px]">
              <img
                src={imagePreview}
                alt="Pin Preview"
                className="w-full h-auto object-cover max-h-[500px]"
              />
              <button
                type="button"
                onClick={() => {
                  setImagePreview('')
                  setImageUrl('')
                  setSelectedFile(null)
                }}
                className="absolute top-3 right-3 p-2 bg-black/70 hover:bg-black text-white rounded-full backdrop-blur-md transition-colors"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragging(false)
                const file = e.dataTransfer.files?.[0]
                if (file) {
                  setSelectedFile(file)
                  const reader = new FileReader()
                  reader.onload = () => {
                    setImagePreview(reader.result)
                    setImageUrl('')
                  }
                  reader.readAsDataURL(file)
                }
              }}
              className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 bg-pin-gray-50/80 hover:bg-pin-gray-100 min-h-[360px] ${
                isDragging ? 'border-pin-red bg-pin-lightRed/30' : 'border-pin-gray-300'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="pin-file-input"
              />
              <label htmlFor="pin-file-input" className="cursor-pointer flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-pin-red mb-4">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="font-bold text-pin-gray-900 text-sm">Choose a file or drag and drop it here</p>
                <p className="text-xs text-pin-gray-500 mt-1">High quality .jpg, .png, or .webp recommended (max 10MB)</p>
              </label>
            </div>
          )}

          {/* Or Paste Image URL */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-pin-gray-500 uppercase tracking-wider">
              <span>Or Paste Image Link</span>
            </div>
            <div className="flex items-center gap-2 bg-pin-gray-100 rounded-2xl px-3 py-2 border border-pin-gray-200 focus-within:border-pin-red focus-within:bg-white transition-all">
              <LinkIcon className="w-4 h-4 text-pin-gray-400 shrink-0" />
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-xs text-pin-gray-900 font-mono"
              />
            </div>
          </div>

          {/* Quick sample pickers */}
          {!imagePreview && (
            <div className="mt-4 pt-3 border-t border-pin-gray-100">
              <span className="text-[11px] font-semibold text-pin-gray-500 block mb-2">Try sample inspirations:</span>
              <div className="grid grid-cols-4 gap-2">
                {sampleInspirationUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Sample ${i + 1}`}
                    onClick={() => handleUrlChange(url)}
                    className="h-14 w-full rounded-xl object-cover cursor-pointer hover:ring-2 hover:ring-pin-red transition-all"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Pin Details Form (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Board Selector Row */}
          <div className="flex items-center justify-between pb-4 border-b border-pin-gray-100">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-pin-gray-500 uppercase tracking-wider">Save to Board</span>
              <p className="text-xs text-pin-gray-400">Choose where this Pin will be organized</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedBoardId}
                onChange={(e) => setSelectedBoardId(e.target.value)}
                className="px-4 py-2.5 rounded-2xl bg-pin-gray-100 font-semibold text-xs text-pin-gray-900 border border-pin-gray-200 outline-none focus:border-pin-red"
              >
                {boards.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsCreateBoardModalOpen(true)}
                className="text-xs font-bold text-pin-red hover:underline shrink-0"
              >
                + New Board
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-2">
              Title <span className="text-pin-red">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Add a clear, catchy title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xl sm:text-2xl font-bold text-pin-gray-900 placeholder:text-pin-gray-300 border-b border-pin-gray-200 pb-2 outline-none focus:border-pin-red transition-colors"
            />
          </div>

          {/* Creator badge */}
          <div className="flex items-center gap-3 py-1">
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-10 h-10 rounded-full object-cover border border-pin-gray-200"
            />
            <div>
              <p className="font-bold text-sm text-pin-gray-900">{currentUser?.name}</p>
              <p className="text-xs text-pin-gray-400">Posting to PinSpace community</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="What makes this pin inspirational? Add styling notes, locations, or materials used..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-pin-gray-200 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium transition-all resize-none"
            />
          </div>

          {/* Destination Link */}
          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-2">
              Destination Link (Optional)
            </label>
            <input
              type="url"
              placeholder="https://archdaily.com, behance.net, etc."
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-pin-gray-200 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium transition-all"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all ${
                    category === cat.id
                      ? 'bg-pin-red text-white shadow-sm'
                      : 'bg-pin-gray-100 text-pin-gray-700 hover:bg-pin-gray-200'
                  }`}
                >
                  {cat.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-2">
              Tagged Topics (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl border border-pin-gray-200 bg-white">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1 bg-pin-gray-100 text-xs font-semibold text-pin-gray-800 rounded-full"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-pin-red"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="border-none outline-none text-xs text-pin-gray-800 font-medium px-2 py-1 flex-1 min-w-[80px]"
              />
            </div>
          </div>

        </div>

      </div>

      <CreateBoardModal
        isOpen={isCreateBoardModalOpen}
        onClose={() => setIsCreateBoardModalOpen(false)}
      />

    </div>
  )
}
