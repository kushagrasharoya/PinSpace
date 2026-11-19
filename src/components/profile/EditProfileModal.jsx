import React, { useState, useEffect } from 'react'
import { X, Camera, Check, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
]

export default function EditProfileModal({ isOpen, onClose }) {
  const { currentUser, updateProfile } = useAuth()
  const { showToast } = useNotification()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [website, setWebsite] = useState('')
  const [avatar, setAvatar] = useState(AVATAR_PRESETS[0])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '')
      setUsername(currentUser.username || '')
      setBio(currentUser.bio || '')
      setWebsite(currentUser.website || '')
      setAvatar(currentUser.avatar || AVATAR_PRESETS[0])
    }
  }, [currentUser, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSaving(true)
      await updateProfile({
        name: name.trim(),
        username: username.trim(),
        bio: bio.trim(),
        website: website.trim(),
        avatar
      })
      showToast('Profile updated successfully!', 'success')
      onClose()
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'warning')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-pin-gray-100 overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-pin-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-xl text-pin-gray-900">Edit Profile</h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-full hover:bg-pin-gray-100 text-pin-gray-500 hover:text-pin-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Avatar selection */}
          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-2">
              Profile Photo
            </label>
            <div className="flex items-center gap-4">
              <img
                src={avatar}
                alt="Profile Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-pin-red shadow-sm"
              />
              <div className="space-y-1.5 flex-1">
                <p className="text-xs text-pin-gray-500 font-medium">Choose an avatar preset or enter custom image URL below:</p>
                <div className="flex items-center gap-2">
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(preset)}
                      className={`relative w-8 h-8 rounded-full overflow-hidden border-2 transition-all ${
                        avatar === preset ? 'border-pin-red scale-110' : 'border-transparent hover:scale-105'
                      }`}
                    >
                      <img src={preset} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                      {avatar === preset && (
                        <div className="absolute inset-0 bg-pin-red/40 flex items-center justify-center text-white">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              disabled={isSaving}
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-xs font-mono disabled:bg-pin-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                required
                disabled={isSaving}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium disabled:bg-pin-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-1.5">
                Username (3-30 chars)
              </label>
              <input
                type="text"
                required
                disabled={isSaving}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium disabled:bg-pin-gray-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-1.5">
              Bio
            </label>
            <textarea
              rows={3}
              disabled={isSaving}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell PinSpace about yourself and what you love to curate..."
              className="w-full px-4 py-2.5 rounded-xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium resize-none disabled:bg-pin-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-1.5">
              Website / Portfolio
            </label>
            <input
              type="text"
              disabled={isSaving}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourportfolio.com"
              className="w-full px-4 py-2.5 rounded-xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium disabled:bg-pin-gray-50"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-pin-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-full font-bold text-sm text-pin-gray-600 hover:bg-pin-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-full font-bold text-sm bg-pin-red hover:bg-pin-redHover text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
