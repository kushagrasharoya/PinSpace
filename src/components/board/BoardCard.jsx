import React from 'react'
import { Link } from 'react-router-dom'
import { Lock, Image as ImageIcon } from 'lucide-react'
import { usePins } from '../../context/PinContext'

export default function BoardCard({ board }) {
  const { pins } = usePins()

  // Get pin objects for this board
  const boardPins = (board.pinIds || [])
    .map(id => pins.find(p => p.id === id))
    .filter(Boolean)

  const pinCount = boardPins.length

  return (
    <Link
      to={`/board/${board.id}`}
      className="group block cursor-pointer transition-transform duration-200 hover:-translate-y-1"
    >
      {/* Board Cover Collage */}
      <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-pin-gray-100 border border-pin-gray-200/80 shadow-sm group-hover:shadow-pin-hover transition-all duration-300">
        {pinCount === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-pin-gray-400 p-6 text-center">
            <ImageIcon className="w-10 h-10 mb-2 stroke-[1.5]" />
            <span className="text-xs font-semibold">Empty Board</span>
          </div>
        ) : pinCount === 1 ? (
          <img
            src={boardPins[0].image}
            alt={board.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : pinCount === 2 ? (
          <div className="grid grid-cols-2 gap-0.5 w-full h-full">
            <img
              src={boardPins[0].image}
              alt={board.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <img
              src={boardPins[1].image}
              alt={board.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          /* 3+ pins: 1 large left, 2 stacked right - iconic Pinterest collage */
          <div className="grid grid-cols-3 gap-0.5 w-full h-full">
            <div className="col-span-2 h-full overflow-hidden">
              <img
                src={boardPins[0].image}
                alt={board.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="grid grid-rows-2 gap-0.5 h-full overflow-hidden">
              <img
                src={boardPins[1].image}
                alt={board.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <img
                src={boardPins[2]?.image || boardPins[0].image}
                alt={board.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        )}
      </div>

      {/* Board Information */}
      <div className="mt-3 px-1">
        <div className="flex items-center gap-1.5">
          <h3 className="font-bold text-base text-pin-gray-900 truncate group-hover:text-pin-red transition-colors">
            {board.name}
          </h3>
          {board.isPrivate && (
            <Lock className="w-3.5 h-3.5 text-pin-gray-500 shrink-0" />
          )}
        </div>
        <p className="text-xs text-pin-gray-500 font-medium mt-0.5">
          {pinCount} {pinCount === 1 ? 'Pin' : 'Pins'}
        </p>
      </div>
    </Link>
  )
}
