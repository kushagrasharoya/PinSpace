import React, { useState, useEffect } from 'react'
import { X, Lock, Globe, Loader2 } from 'lucide-react'
import { usePins } from '../../context/PinContext'

export default function EditBoardModal({ board, isOpen, onClose }) {
  const { updateBoard } = usePins()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (board) {
      setName(board.name || '')
      setDescription(board.description || '')
      setIsPrivate(Boolean(board.isPrivate))
    }
  }, [board, isOpen])

  if (!isOpen || !board) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      setIsSaving(true)
      await updateBoard(board.id, {
        name: name.trim(),
        description: description.trim(),
        is_private: isPrivate,
        isPrivate
      })
      onClose()
    } catch (err) {
      console.error('Error updating board:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-pin-gray-100 overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-pin-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-xl text-pin-gray-900">Edit board</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-pin-gray-100 text-pin-gray-500 hover:text-pin-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-2">
              Name
            </label>
            <input
              type="text"
              required
              disabled={isSaving}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium transition-all disabled:bg-pin-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-2">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              disabled={isSaving}
              placeholder="What's this board about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium transition-all resize-none disabled:bg-pin-gray-50"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-pin-gray-50 border border-pin-gray-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {isPrivate ? (
                  <Lock className="w-4 h-4 text-pin-red" />
                ) : (
                  <Globe className="w-4 h-4 text-pin-gray-600" />
                )}
                <span className="font-semibold text-sm text-pin-gray-900">
                  {isPrivate ? 'Secret board' : 'Public board'}
                </span>
              </div>
              <p className="text-xs text-pin-gray-500 leading-relaxed">
                {isPrivate
                  ? 'Only you can see this board.'
                  : 'Anyone on PinSpace can discover this board and its pins.'}
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={isPrivate}
                disabled={isSaving}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-pin-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pin-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pin-red"></div>
            </label>
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
              disabled={!name.trim() || isSaving}
              className="px-6 py-2.5 rounded-full font-bold text-sm bg-pin-red hover:bg-pin-redHover text-white shadow-sm disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2"
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
