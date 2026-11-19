import React from 'react'
import PinCard from './PinCard'
import { Sparkles, SearchX } from 'lucide-react'

export default function MasonryGrid({ pins, isLoading = false, onClearFilters }) {
  if (isLoading) {
    return (
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 sm:gap-6 max-w-[1920px] mx-auto px-3 sm:px-6 py-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="mb-6 break-inside-avoid">
            <div
              className="bg-pin-gray-200 rounded-2xl sm:rounded-3xl animate-pulse"
              style={{ height: `${[240, 320, 190, 280, 360, 220][i % 6]}px` }}
            />
            <div className="mt-2.5 space-y-1.5">
              <div className="h-4 bg-pin-gray-200 rounded-md w-3/4 animate-pulse" />
              <div className="h-3 bg-pin-gray-200 rounded-md w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!pins || pins.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center py-20 px-4">
        <div className="w-16 h-16 bg-pin-lightRed text-pin-red rounded-full flex items-center justify-center mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-pin-gray-900 mb-2">No pins found</h3>
        <p className="text-sm text-pin-gray-500 mb-6">
          We couldn't find any pins matching your search or filters. Try exploring other keywords or categories.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-6 py-2.5 bg-pin-red hover:bg-pin-redHover text-white rounded-full font-bold text-sm shadow-sm transition-transform active:scale-95"
          >
            Clear Filters
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 sm:gap-6 max-w-[1920px] mx-auto px-3 sm:px-6 py-4">
      {pins.map((pin) => (
        <PinCard key={pin.id} pin={pin} />
      ))}
    </div>
  )
}
