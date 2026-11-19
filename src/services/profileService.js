import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { validateProfileData } from '../lib/validation'

export { validateProfileData }

/**
 * Fetch a user profile by user UUID
 * @param {string} userId - UUID of the user
 */
export const getProfileById = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required to fetch profile.')
  }

  if (!isSupabaseConfigured()) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, bio, website, created_at, updated_at')
    .eq('id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Record not found
      return null
    }
    console.error('Error fetching profile by ID:', error)
    throw new Error(error.message)
  }

  return data
}

/**
 * Fetch a user profile by username
 * @param {string} username - Unique handle
 */
export const getProfileByUsername = async (username) => {
  if (!username) {
    throw new Error('Username is required.')
  }

  if (!isSupabaseConfigured()) {
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, bio, website, created_at, updated_at')
    .eq('username', username.trim().toLowerCase())
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching profile by username:', error)
    throw new Error(error.message)
  }

  return data
}

/**
 * Check if a username is available
 */
export const isUsernameAvailable = async (username, excludeUserId = null) => {
  if (!isSupabaseConfigured() || !username) return true

  let query = supabase
    .from('profiles')
    .select('id')
    .eq('username', username.trim().toLowerCase())

  if (excludeUserId) {
    query = query.neq('id', excludeUserId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error checking username availability:', error)
    return true
  }

  return data.length === 0
}

/**
 * Create or initialize profile row
 */
export const createProfile = async (profileData) => {
  if (!isSupabaseConfigured()) {
    return profileData
  }

  const validation = validateProfileData(profileData)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const payload = {
    id: profileData.id,
    username: profileData.username.trim().toLowerCase(),
    full_name: profileData.full_name || profileData.name || '',
    avatar_url: profileData.avatar_url || '',
    bio: profileData.bio || '',
    website: profileData.website || '',
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert([payload])
    .select()
    .single()

  if (error) {
    console.error('Error creating profile:', error)
    throw new Error(error.message)
  }

  return data
}

/**
 * Update an existing user profile
 * @param {string} userId - UUID
 * @param {object} updates - Fields to update
 */
export const updateProfile = async (userId, updates) => {
  if (!userId) {
    throw new Error('User ID is required to update profile.')
  }

  if (!isSupabaseConfigured()) {
    return { ...updates, id: userId }
  }

  const validation = validateProfileData(updates)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Check username uniqueness if username is being changed
  if (updates.username) {
    const available = await isUsernameAvailable(updates.username, userId)
    if (!available) {
      throw new Error(`Username "${updates.username}" is already taken.`)
    }
  }

  const payload = {
    ...updates,
    updated_at: new Date().toISOString()
  }

  if (payload.username) {
    payload.username = payload.username.trim().toLowerCase()
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error(error.message)
  }

  return data
}
