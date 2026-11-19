import React from 'react'
import { Sparkles, Compass, Flame, TrendingUp, ArrowRight } from 'lucide-react'
import { CATEGORIES } from '../data/mockCategories'
import { usePins } from '../context/PinContext'
import MasonryGrid from '../components/pin/MasonryGrid'

export default function ExplorePage() {
  const { pins, activeCategory, setActiveCategory, setSearchQuery, isLoadingPins } = usePins()

  // Explore categories excluding 'all'
  const displayCategories = CATEGORIES.filter(c => c.id !== 'all')

  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId)
    window.scrollTo({ top: 600, behavior: 'smooth' })
  }

  // Active pins for the explore section
  const explorePins = activeCategory === 'all'
    ? pins
    : pins.filter(p => p.category === activeCategory)

  const activeCategoryObj = CATEGORIES.find(c => c.id === activeCategory)

  return (
    <div className="min-h-screen pb-20">
      
      {/* Hero Curated Spotlight */}
      <section className="bg-gradient-to-b from-pin-gray-50 to-white pt-8 pb-12 px-4 sm:px-6 border-b border-pin-gray-100">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pin-lightRed text-pin-red text-xs font-bold tracking-wide uppercase">
            <Flame className="w-4 h-4" />
            <span>Trending on PinSpace</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-pin-gray-950 tracking-tight max-w-2xl mx-auto">
            Explore curated aesthetics & daily inspirations
          </h1>

          <p className="text-sm sm:text-base text-pin-gray-600 max-w-xl mx-auto">
            Discover new ideas for minimalist architecture, cozy interior spaces, editorial fashion, and futuristic design.
          </p>

          {/* Quick topic tags */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {['#ConcreteLofts', '#JapandiHome', '#Film35mm', '#NordicCabin', '#OctaneRender', '#AmalfiCoast'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag.replace('#', ''))}
                className="px-3 py-1.5 rounded-full bg-white border border-pin-gray-200 text-xs font-semibold text-pin-gray-700 hover:border-pin-red hover:text-pin-red transition-all shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Visual Category Cards Grid */}
        <div className="max-w-7xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {displayCategories.map((cat) => {
            const isSelected = activeCategory === cat.id
            return (
              <div
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`group relative h-48 sm:h-64 rounded-3xl overflow-hidden cursor-pointer shadow-sm transition-all duration-300 hover:shadow-pin-hover ${
                  isSelected ? 'ring-4 ring-pin-red' : ''
                }`}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                  <h3 className="font-bold text-base sm:text-lg leading-tight group-hover:translate-x-1 transition-transform">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-2 mt-1 hidden sm:block">
                    {cat.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Discovery Feed Section */}
      <section className="max-w-[1920px] mx-auto px-4 sm:px-6 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-pin-red" />
            <h2 className="text-xl sm:text-2xl font-bold text-pin-gray-900">
              {activeCategory === 'all' ? 'Popular Inspirations' : activeCategoryObj?.name}
            </h2>
            <span className="text-sm text-pin-gray-400">({explorePins.length} pins)</span>
          </div>

          {activeCategory !== 'all' && (
            <button
              onClick={() => setActiveCategory('all')}
              className="text-xs font-bold text-pin-red hover:underline"
            >
              Show all categories
            </button>
          )}
        </div>

        <MasonryGrid pins={explorePins} isLoading={isLoadingPins} />
      </section>

    </div>
  )
}
