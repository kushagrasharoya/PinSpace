import React, { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  Bell,
  MessageCircle,
  Plus,
  X,
  Compass,
  Home,
  User,
  LogOut,
  FolderHeart,
  Sparkles,
  ExternalLink,
  Check
} from 'lucide-react'
import { usePins } from '../../context/PinContext'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'

export default function Navbar({ onOpenCreateBoard }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { searchQuery, setSearchQuery, setActiveCategory } = usePins()
  const { currentUser, isAuthenticated, logout } = useAuth()
  const { showToast } = useNotification()

  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const searchContainerRef = useRef(null)
  const profileMenuRef = useRef(null)
  const createMenuRef = useRef(null)
  const notificationsRef = useRef(null)

  // Popular search suggestions
  const searchSuggestions = [
    'Minimalist architecture',
    'Japandi interiors',
    '3D fluid typography',
    'Amalfi coast aesthetic',
    'Editorial streetwear',
    'Artisan sourdough'
  ]

  // Mock notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      user: 'Kenzo Tange Studio',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      action: 'saved your Pin to Modernist Villas',
      time: '10m ago',
      read: false
    },
    {
      id: 2,
      user: 'Freja Lindqvist',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
      action: 'started following you',
      time: '1h ago',
      read: false
    },
    {
      id: 3,
      user: 'Matteo Bellini',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
      action: 'liked your photo in Dolomite Views',
      time: '4h ago',
      read: true
    }
  ])

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false)
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false)
      }
      if (createMenuRef.current && !createMenuRef.current.contains(e.target)) {
        setShowCreateMenu(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setIsSearchFocused(false)
    if (location.pathname !== '/' && location.pathname !== '/explore') {
      navigate('/')
    }
  }

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion)
    setIsSearchFocused(false)
    if (location.pathname !== '/' && location.pathname !== '/explore') {
      navigate('/')
    }
  }

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    showToast('Notifications marked as read', 'info')
  }

  const handleLogout = async () => {
    setShowProfileMenu(false)
    try {
      await logout()
      showToast('Logged out of PinSpace', 'info')
      navigate('/')
    } catch (err) {
      showToast(err.message || 'Logout failed', 'warning')
    }
  }

  const handleCreateBoardClick = () => {
    setShowCreateMenu(false)
    setShowProfileMenu(false)
    if (!isAuthenticated) {
      showToast('Please log in to create a board', 'info')
      navigate('/login', { state: { from: location } })
      return
    }
    if (onOpenCreateBoard) onOpenCreateBoard()
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pin-gray-100 transition-shadow duration-200">
        <div className="max-w-[1920px] mx-auto px-3 sm:px-5 h-16 sm:h-20 flex items-center gap-2 sm:gap-4">
          
          {/* Logo */}
          <Link
            to="/"
            onClick={() => {
              setSearchQuery('')
              setActiveCategory('all')
            }}
            className="flex items-center gap-2.5 p-2 rounded-full hover:bg-pin-gray-100 transition-colors shrink-0 group"
            title="PinSpace Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-pin-red flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <span className="font-black text-xl sm:text-2xl leading-none">P</span>
            </div>
            <span className="hidden md:block font-bold text-xl tracking-tight text-pin-red">
              PinSpace
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1.5 shrink-0">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                  isActive && location.pathname === '/'
                    ? 'bg-pin-gray-900 text-white shadow-sm'
                    : 'text-pin-gray-800 hover:bg-pin-gray-100'
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-pin-gray-900 text-white shadow-sm'
                    : 'text-pin-gray-800 hover:bg-pin-gray-100'
                }`
              }
            >
              Explore
            </NavLink>

            {/* Create Dropdown */}
            <div className="relative" ref={createMenuRef}>
              <button
                onClick={() => setShowCreateMenu(!showCreateMenu)}
                className={`flex items-center gap-1 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                  showCreateMenu || location.pathname === '/create'
                    ? 'bg-pin-gray-100 text-pin-gray-900'
                    : 'text-pin-gray-800 hover:bg-pin-gray-100'
                }`}
              >
                <span>Create</span>
                <Plus className="w-4 h-4 ml-0.5" />
              </button>

              {showCreateMenu && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-dropdown border border-pin-gray-200/80 py-2 z-50 animate-scale-in">
                  <Link
                    to="/create"
                    onClick={() => setShowCreateMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-pin-gray-100 transition-colors text-pin-gray-800 text-sm font-medium"
                  >
                    <div className="w-8 h-8 rounded-full bg-pin-lightRed text-pin-red flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-pin-gray-900">Create Pin</p>
                      <p className="text-xs text-pin-gray-500">Publish your inspiration</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleCreateBoardClick}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-pin-gray-100 transition-colors text-pin-gray-800 text-sm font-medium"
                  >
                    <div className="w-8 h-8 rounded-full bg-pin-gray-100 text-pin-gray-700 flex items-center justify-center">
                      <FolderHeart className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-pin-gray-900">Create Board</p>
                      <p className="text-xs text-pin-gray-500">Organize your saves</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Search Bar with live popup */}
          <div className="flex-1 relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div
                className={`flex items-center h-12 w-full bg-pin-gray-100 rounded-full px-4 transition-all duration-200 border ${
                  isSearchFocused
                    ? 'bg-white border-pin-red ring-2 ring-pin-lightRed shadow-sm'
                    : 'border-transparent hover:bg-pin-gray-200/80'
                }`}
              >
                <Search className={`w-5 h-5 shrink-0 transition-colors ${isSearchFocused ? 'text-pin-red' : 'text-pin-gray-500'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search for architecture, 3D design, outfits, recipes..."
                  className="w-full bg-transparent border-none outline-none px-3 text-sm text-pin-gray-900 placeholder:text-pin-gray-500 font-medium"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 hover:bg-pin-gray-300 rounded-full text-pin-gray-500 hover:text-pin-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Suggestions Popover */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-dropdown border border-pin-gray-200/70 p-4 z-50 animate-scale-in">
                <div className="mb-3 px-2 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-pin-gray-500">Popular Searches</span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-pin-red hover:underline font-medium"
                    >
                      Clear search
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {searchSuggestions.map((item, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSelectSuggestion(item)}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-pin-gray-100 hover:bg-pin-gray-200 text-sm font-medium text-pin-gray-800 transition-colors"
                    >
                      <Search className="w-3.5 h-3.5 text-pin-gray-400" />
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            
            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-full text-pin-gray-700 hover:bg-pin-gray-100 transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-pin-red rounded-full ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-dropdown border border-pin-gray-200/80 py-3 z-50 animate-scale-in">
                  <div className="px-5 py-2 border-b border-pin-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-pin-gray-900 text-base">Updates & Activity</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-xs font-semibold text-pin-red hover:underline flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-pin-gray-50">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-5 py-3.5 flex items-start gap-3 hover:bg-pin-gray-50 transition-colors ${
                          !n.read ? 'bg-pin-lightRed/30' : ''
                        }`}
                      >
                        <img
                          src={n.avatar}
                          alt={n.user}
                          className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5 border border-pin-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-pin-gray-800 leading-snug">
                            <span className="font-semibold text-pin-gray-900">{n.user}</span>{' '}
                            {n.action}
                          </p>
                          <span className="text-xs text-pin-gray-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Messages button */}
            <button
              onClick={() => showToast('PinSpace Direct Messages preview', 'info')}
              className="p-2.5 rounded-full text-pin-gray-700 hover:bg-pin-gray-100 transition-colors hidden sm:flex"
              title="Messages"
              aria-label="Messages"
            >
              <MessageCircle className="w-5 h-5" />
            </button>

            {/* Profile Avatar & Menu */}
            <div className="relative" ref={profileMenuRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center p-0.5 rounded-full hover:ring-2 hover:ring-pin-red/30 transition-all"
                  aria-label="User menu"
                >
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-pin-gray-200 shadow-sm"
                  />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-2 text-sm font-semibold text-pin-gray-800 hover:bg-pin-gray-100 rounded-full transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold bg-pin-red hover:bg-pin-redHover text-white rounded-full transition-colors shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Profile dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-3xl shadow-dropdown border border-pin-gray-200/80 p-2 z-50 animate-scale-in">
                  <div className="p-3 border-b border-pin-gray-100 flex items-center gap-3">
                    <img
                      src={currentUser?.avatar}
                      alt={currentUser?.name}
                      className="w-12 h-12 rounded-full object-cover border border-pin-gray-200"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-pin-gray-900 truncate">{currentUser?.name}</p>
                      <p className="text-xs text-pin-gray-500 truncate">{currentUser?.handle}</p>
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pin-gray-100 text-sm font-medium text-pin-gray-800 transition-colors"
                    >
                      <User className="w-4 h-4 text-pin-gray-500" />
                      <span>View Profile & Saves</span>
                    </Link>

                    <Link
                      to="/create"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pin-gray-100 text-sm font-medium text-pin-gray-800 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-pin-gray-500" />
                      <span>Create New Pin</span>
                    </Link>

                    <button
                      onClick={handleCreateBoardClick}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-pin-gray-100 text-sm font-medium text-pin-gray-800 transition-colors"
                    >
                      <FolderHeart className="w-4 h-4 text-pin-gray-500" />
                      <span>Create New Board</span>
                    </button>
                  </div>

                  <div className="pt-1 border-t border-pin-gray-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-sm font-medium text-rose-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-pin-gray-200 px-6 py-2 flex items-center justify-around shadow-lg">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 transition-colors ${
              isActive && location.pathname === '/' ? 'text-pin-red font-bold' : 'text-pin-gray-500'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </NavLink>

        <NavLink
          to="/explore"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 transition-colors ${
              isActive ? 'text-pin-red font-bold' : 'text-pin-gray-500'
            }`
          }
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 transition-colors ${
              isActive ? 'text-pin-red font-bold' : 'text-pin-gray-500'
            }`
          }
        >
          <div className="w-7 h-7 bg-pin-red rounded-full flex items-center justify-center text-white shadow-sm">
            <Plus className="w-4 h-4" />
          </div>
          <span className="text-[10px]">Create</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-1 transition-colors ${
              isActive ? 'text-pin-red font-bold' : 'text-pin-gray-500'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </NavLink>
      </div>
    </>
  )
}
