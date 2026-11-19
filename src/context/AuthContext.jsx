import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { getProfileById, updateProfile as updateProfileInDb } from '../services/profileService'
import { validatePassword } from '../lib/validation'

export { validatePassword }

const AuthContext = createContext(null)

const DEMO_USER = {
  id: 'user-demo-aria',
  name: 'Aria Sterling',
  username: 'ariasterling',
  handle: '@ariasterling',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bio: 'Visual designer, architectural photographer, & curator of calm spaces. Obsessed with concrete, warm oak, and Japanese ceramic art.',
  website: 'https://ariasterling.design',
  email: 'aria@pinspace.design',
  followersCount: 1420,
  followingCount: 388,
  savedCount: 28
}

export function AuthProvider({ children }) {
  const isConfigured = isSupabaseConfigured()

  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(() => {
    if (!isConfigured) {
      try {
        const stored = localStorage.getItem('pinspace_user')
        return stored ? JSON.parse(stored) : DEMO_USER
      } catch {
        return DEMO_USER
      }
    }
    return null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (!isConfigured) {
      return localStorage.getItem('pinspace_auth') !== 'false'
    }
    return false
  })
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Helper to format a Supabase user + public profile into standard frontend user object
   */
  const formatUserObject = useCallback((authUser, profileData) => {
    if (!authUser) return null

    const meta = authUser.user_metadata || {}
    const username = profileData?.username || meta.username || authUser.email?.split('@')[0] || 'user'
    const name = profileData?.full_name || meta.full_name || meta.name || username
    const avatar = profileData?.avatar_url || meta.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'

    return {
      id: authUser.id,
      email: authUser.email,
      name,
      username,
      handle: `@${username.toLowerCase()}`,
      avatar,
      bio: profileData?.bio || meta.bio || '',
      website: profileData?.website || meta.website || '',
      followersCount: 0,
      followingCount: 0,
      createdAt: authUser.created_at
    }
  }, [])

  /**
   * Loads public profile from PostgreSQL profiles table for an authenticated user
   */
  const loadUserProfile = useCallback(async (authUser) => {
    if (!authUser || !isConfigured) return null

    try {
      const profile = await getProfileById(authUser.id)
      const formatted = formatUserObject(authUser, profile)
      setCurrentUser(formatted)
      return formatted
    } catch (err) {
      console.warn('Could not load profile from database, using auth metadata:', err)
      const formatted = formatUserObject(authUser, null)
      setCurrentUser(formatted)
      return formatted
    }
  }, [isConfigured, formatUserObject])

  // Initialize session & register listener for Supabase Auth changes
  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false)
      return
    }

    let isMounted = true

    // 1. Check active session on initial load
    supabase.auth.getSession().then(({ data: { session: activeSession }, error }) => {
      if (error) {
        console.error('Error fetching initial Supabase session:', error)
      }

      if (isMounted) {
        if (activeSession?.user) {
          setSession(activeSession)
          setUser(activeSession.user)
          setIsAuthenticated(true)
          loadUserProfile(activeSession.user)
        } else {
          setSession(null)
          setUser(null)
          setCurrentUser(null)
          setIsAuthenticated(false)
        }
        setIsLoading(false)
      }
    })

    // 2. Subscribe to auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted) return

        setSession(newSession)
        const newUser = newSession?.user ?? null
        setUser(newUser)
        setIsAuthenticated(Boolean(newUser))

        if (newUser) {
          await loadUserProfile(newUser)
        } else {
          setCurrentUser(null)
        }
        setIsLoading(false)
      }
    )

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [isConfigured, loadUserProfile])

  /**
   * Register with Supabase Auth
   * @param {object} userData - { email, password, name, username }
   */
  const register = async (userData) => {
    const passwordValidation = validatePassword(userData.password)
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error)
    }

    if (!userData.email || !userData.email.includes('@')) {
      throw new Error('Please enter a valid email address.')
    }

    const cleanUsername = (userData.username || userData.name || 'user')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')

    if (!isConfigured) {
      // Local development simulation when .env is not yet configured
      const newUser = {
        ...DEMO_USER,
        id: `user-${Date.now()}`,
        name: userData.name || cleanUsername,
        username: cleanUsername,
        handle: `@${cleanUsername}`,
        email: userData.email
      }
      setCurrentUser(newUser)
      setIsAuthenticated(true)
      localStorage.setItem('pinspace_user', JSON.stringify(newUser))
      localStorage.setItem('pinspace_auth', 'true')
      return { user: newUser, session: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email: userData.email.trim(),
      password: userData.password,
      options: {
        data: {
          name: userData.name ? userData.name.trim() : cleanUsername,
          full_name: userData.name ? userData.name.trim() : cleanUsername,
          username: cleanUsername
        }
      }
    })

    if (error) {
      console.error('Supabase registration error:', error)
      throw new Error(error.message)
    }

    if (data?.user) {
      await loadUserProfile(data.user)
    }

    return data
  }

  /**
   * Login with Supabase Auth
   * @param {string} email
   * @param {string} password
   */
  const login = async (email, password) => {
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      throw new Error(passwordValidation.error)
    }

    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email address.')
    }

    if (!isConfigured) {
      // Local development simulation
      setCurrentUser(DEMO_USER)
      setIsAuthenticated(true)
      localStorage.setItem('pinspace_user', JSON.stringify(DEMO_USER))
      localStorage.setItem('pinspace_auth', 'true')
      return { user: DEMO_USER, session: null }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

    if (error) {
      console.error('Supabase login error:', error)
      throw new Error(error.message)
    }

    if (data?.user) {
      await loadUserProfile(data.user)
    }

    return data
  }

  /**
   * Logout from Supabase Auth
   */
  const logout = async () => {
    if (!isConfigured) {
      setIsAuthenticated(false)
      localStorage.setItem('pinspace_auth', 'false')
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Supabase logout error:', error)
      throw new Error(error.message)
    }

    setSession(null)
    setUser(null)
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  /**
   * Update current user's profile
   * @param {object} updatedFields
   */
  const updateProfile = async (updatedFields) => {
    if (!currentUser) return null

    // If live Supabase connection is available, update database table
    if (isConfigured && user?.id) {
      const dbPayload = {}
      if (updatedFields.name) dbPayload.full_name = updatedFields.name
      if (updatedFields.username) dbPayload.username = updatedFields.username
      if (updatedFields.bio !== undefined) dbPayload.bio = updatedFields.bio
      if (updatedFields.website !== undefined) dbPayload.website = updatedFields.website
      if (updatedFields.avatar) dbPayload.avatar_url = updatedFields.avatar

      const updatedDbProfile = await updateProfileInDb(user.id, dbPayload)
      const formatted = formatUserObject(user, updatedDbProfile)
      setCurrentUser(formatted)
      return formatted
    }

    // Fallback local update
    const updated = {
      ...currentUser,
      ...updatedFields,
      handle: updatedFields.username ? `@${updatedFields.username.toLowerCase()}` : currentUser.handle
    }
    setCurrentUser(updated)
    localStorage.setItem('pinspace_user', JSON.stringify(updated))
    return updated
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        currentUser,
        isAuthenticated,
        isLoading,
        isConfigured,
        login,
        register,
        logout,
        updateProfile,
        validatePassword
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
