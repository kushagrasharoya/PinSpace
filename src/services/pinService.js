import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { validatePinData } from '../lib/validation'

export { validatePinData }

/**
 * Fetch all public pins with author profile information
 * @param {object} options - Filters and pagination options
 */
export const fetchPins = async ({
  category = 'all',
  search = '',
  tag = '',
  userId = null,
  limit = 50,
  offset = 0
} = {}) => {
  if (!isSupabaseConfigured()) {
    return []
  }

  let query = supabase
    .from('pins')
    .select(`
      id,
      user_id,
      title,
      description,
      image_url,
      destination_url,
      aspect_ratio,
      category,
      tags,
      created_at,
      updated_at,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  // Filter by user/creator
  if (userId) {
    query = query.eq('user_id', userId)
  }

  // Filter by category
  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  // Filter by specific tag
  if (tag && tag.trim()) {
    query = query.contains('tags', [tag.trim().toLowerCase()])
  }

  // Filter by search query (title, description or tag)
  if (search && search.trim()) {
    const term = `%${search.trim()}%`
    query = query.or(`title.ilike.${term},description.ilike.${term}`)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching pins:', error)
    throw new Error(error.message)
  }

  return data || []
}

/**
 * Fetch a single pin by its UUID
 * @param {string} pinId - UUID
 */
export const fetchPinById = async (pinId) => {
  if (!pinId) {
    throw new Error('Pin ID is required.')
  }

  if (!isSupabaseConfigured()) {
    return null
  }

  const { data, error } = await supabase
    .from('pins')
    .select(`
      id,
      user_id,
      title,
      description,
      image_url,
      destination_url,
      aspect_ratio,
      category,
      tags,
      created_at,
      updated_at,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('id', pinId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching pin by ID:', error)
    throw new Error(error.message)
  }

  return data
}

/**
 * Create a new pin
 * @param {object} pinData
 */
export const createPin = async (pinData) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.')
  }

  const validation = validatePinData(pinData)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const payload = {
    user_id: pinData.user_id,
    title: pinData.title.trim(),
    description: pinData.description ? pinData.description.trim() : '',
    image_url: pinData.image_url.trim(),
    destination_url: pinData.destination_url ? pinData.destination_url.trim() : null,
    aspect_ratio: pinData.aspect_ratio || 'medium',
    category: pinData.category || 'all',
    tags: Array.isArray(pinData.tags)
      ? pinData.tags.map(t => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean)
      : [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('pins')
    .insert([payload])
    .select(`
      id,
      user_id,
      title,
      description,
      image_url,
      destination_url,
      aspect_ratio,
      category,
      tags,
      created_at,
      updated_at,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .single()

  if (error) {
    console.error('Error creating pin:', error)
    throw new Error(error.message)
  }

  return data
}

/**
 * Update a pin (only author permitted by RLS)
 * @param {string} pinId - UUID
 * @param {object} updates
 */
export const updatePin = async (pinId, updates) => {
  if (!pinId) {
    throw new Error('Pin ID is required to update.')
  }

  if (!isSupabaseConfigured()) {
    return updates
  }

  const payload = {
    ...updates,
    updated_at: new Date().toISOString()
  }

  if (payload.tags && Array.isArray(payload.tags)) {
    payload.tags = payload.tags.map(t => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean)
  }

  const { data, error } = await supabase
    .from('pins')
    .update(payload)
    .eq('id', pinId)
    .select(`
      id,
      user_id,
      title,
      description,
      image_url,
      destination_url,
      aspect_ratio,
      category,
      tags,
      created_at,
      updated_at,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .single()

  if (error) {
    console.error('Error updating pin:', error)
    throw new Error(error.message)
  }

  return data
}

/**
 * Delete a pin by ID (only author permitted by RLS)
 * @param {string} pinId - UUID
 */
export const deletePin = async (pinId) => {
  if (!pinId) {
    throw new Error('Pin ID is required to delete.')
  }

  if (!isSupabaseConfigured()) {
    return true
  }

  const { error } = await supabase
    .from('pins')
    .delete()
    .eq('id', pinId)

  if (error) {
    console.error('Error deleting pin:', error)
    throw new Error(error.message)
  }

  return true
}

/**
 * Search pins across title, description, and tags
 * @param {string} query - Search term
 * @param {number} limit
 */
export const searchPins = async (query, limit = 50) => {
  if (!query || query.trim().length === 0) {
    return fetchPins({ limit })
  }

  return fetchPins({ search: query, limit })
}

/**
 * Fetch related pins for a given pin
 * @param {string} pinId - Target pin ID to exclude
 * @param {string} category - Target category
 * @param {string[]} tags - Target tags
 * @param {number} limit
 */
export const fetchRelatedPins = async (pinId, category, tags = [], limit = 12) => {
  if (!isSupabaseConfigured()) {
    return []
  }

  let query = supabase
    .from('pins')
    .select(`
      id,
      user_id,
      title,
      description,
      image_url,
      aspect_ratio,
      category,
      tags,
      created_at,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .neq('id', pinId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching related pins:', error)
    return []
  }

  return data || []
}
