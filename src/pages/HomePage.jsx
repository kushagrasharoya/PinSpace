import React from 'react'
import { Sparkles, SlidersHorizontal, X, RefreshCw, AlertCircle } from 'lucide-react'
import MasonryGrid from '../components/pin/MasonryGrid'
import { usePins } from '../context/PinContext'
import { CATEGORIES } from '../data/mockCategories'

export default function HomePage() {
  const {
    filteredPins,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    isLoadingPins,
    pinsError,
    refreshPins
  } = usePins()

  const handleClearFilters = () => {
    setActiveCategory('all')
    setSearchQuery('')
  }

  const hasActiveFilters = activeCategory !== 'all' || searchQuery.trim().length > 0

  return (
    <div className="min-h-screen pb-20">
      
      {/* Category Pills Bar */}
      <div className="sticky top-16 sm:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-pin-gray-100/80 py-3">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-pin-gray-900 text-white shadow-sm'
                      : 'bg-pin-gray-100 hover:bg-pin-gray-200 text-pin-gray-800'
                  }`}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>

          <button
            onClick={refreshPins}
            disabled={isLoadingPins}
            className="p-2.5 rounded-full hover:bg-pin-gray-100 text-pin-gray-600 hover:text-pin-gray-900 transition-colors shrink-0 hidden sm:flex"
            title="Refresh feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingPins ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Error State Banner */}
      {pinsError && (
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 pt-4">
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <p className="font-bold text-sm">Failed to load live pins from Supabase</p>
                <p className="text-xs text-rose-600">{pinsError}</p>
              </div>
            </div>
            <button
              onClick={refreshPins}
              className="px-4 py-1.5 bg-rose-600 text-white rounded-full text-xs font-bold hover:bg-rose-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Active Search & Filter notification indicator */}
      {hasActiveFilters && (
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-pin-gray-600">
            <span>Showing results for</span>
            {searchQuery && (
              <span className="font-bold text-pin-gray-900">"{searchQuery}"</span>
            )}
            {activeCategory !== 'all' && (
              <span className="bg-pin-lightRed text-pin-red px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {CATEGORIES.find(c => c.id === activeCategory)?.name}
              </span>
            )}
            <span className="text-pin-gray-400">({filteredPins.length} pins)</span>
          </div>

          <button
            onClick={handleClearFilters}
            className="flex items-center gap-1 text-xs font-bold text-pin-red hover:underline"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>
      )}

      {/* Masonry Pin Grid */}
      <main className="pt-2">
        <MasonryGrid
          pins={filteredPins}
          isLoading={isLoadingPins}
          onClearFilters={handleClearFilters}
        />
      </main>
    </div>
  )
}
