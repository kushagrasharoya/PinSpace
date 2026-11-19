import React, { useState } from 'react'
import { X, Lock, Globe, Plus, Check } from 'lucide-react'
import { usePins } from '../../context/PinContext'

export default function SaveToBoardModal({ pin, isOpen, onClose }) {
  const { boards, toggleSaveToBoard, createBoard } = usePins()
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [newBoardName, setNewBoardName] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  if (!isOpen || !pin) return null

  const handleCreateAndSave = async (e) => {
    e.preventDefault()
    if (!newBoardName.trim()) return
    await createBoard({
      name: newBoardName.trim(),
      isPrivate,
      initialPinId: pin.id
    })
    setIsCreatingNew(false)
    setNewBoardName('')
    onClose()
  }

  const handleSaveToExisting = async (boardId) => {
    await toggleSaveToBoard(pin.id, boardId)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-pin-gray-100 overflow-hidden animate-scale-in">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-pin-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-lg text-pin-gray-900">Save to board</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-pin-gray-100 text-pin-gray-500 hover:text-pin-gray-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pin Preview info */}
        <div className="p-5 flex items-center gap-3.5 bg-pin-gray-50/70 border-b border-pin-gray-100">
          <img
            src={pin.image}
            alt={pin.title}
            className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-sm text-pin-gray-900 truncate">{pin.title}</h4>
            <p className="text-xs text-pin-gray-500 truncate mt-0.5">{pin.author?.name || 'PinSpace Creator'}</p>
          </div>
        </div>

        {/* Board List */}
        <div className="max-h-72 overflow-y-auto p-4 space-y-1">
          {boards.map((board) => {
            const isSaved = board.pinIds?.includes(pin.id)
            return (
              <div
                key={board.id}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-pin-gray-100 transition-colors group cursor-pointer"
                onClick={() => handleSaveToExisting(board.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-pin-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {board.coverImage ? (
                      <img src={board.coverImage} alt={board.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-pin-gray-500">{board.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-sm text-pin-gray-900 truncate">{board.name}</p>
                      {board.isPrivate ? (
                        <Lock className="w-3.5 h-3.5 text-pin-gray-400" />
                      ) : null}
                    </div>
                    <p className="text-xs text-pin-gray-500">
                      {board.pinIds?.length || 0} {board.pinIds?.length === 1 ? 'pin' : 'pins'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSaveToExisting(board.id)
                  }}
                  className={`px-4 py-2 rounded-full font-bold text-xs transition-transform active:scale-95 ${
                    isSaved
                      ? 'bg-pin-gray-900 text-white hover:bg-pin-gray-800'
                      : 'bg-pin-red text-white hover:bg-pin-redHover shadow-sm'
                  }`}
                >
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Create new board toggle */}
        <div className="p-4 border-t border-pin-gray-100 bg-white">
          {!isCreatingNew ? (
            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-pin-gray-300 hover:bg-pin-gray-50 font-semibold text-sm text-pin-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4 text-pin-red" />
              <span>Create new board</span>
            </button>
          ) : (
            <form onSubmit={handleCreateAndSave} className="space-y-3">
              <input
                type="text"
                autoFocus
                placeholder="Board name (e.g. Dream Living Room)"
                value={newBoardName}
                onChange={(e) => setNewBoardName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium"
              />
              <div className="flex items-center justify-between text-xs text-pin-gray-600 px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="accent-pin-red rounded"
                  />
                  <span>Keep this board secret</span>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="flex-1 py-2 rounded-full text-xs font-semibold text-pin-gray-600 hover:bg-pin-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newBoardName.trim()}
                  className="flex-1 py-2 rounded-full text-xs font-bold bg-pin-red hover:bg-pin-redHover text-white disabled:opacity-50 transition-colors"
                >
                  Create & Save
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
