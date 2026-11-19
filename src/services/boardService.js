import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { validateBoardData } from '../lib/validation'

export { validateBoardData }

/**
 * Create a new board
 * @param {object} boardData - { user_id, name, description, is_private }
 */
export const createBoard = async (boardData) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.')
  }

  const validation = validateBoardData(boardData)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  const payload = {
    user_id: boardData.user_id,
    name: boardData.name.trim(),
    description: boardData.description ? boardData.description.trim() : '',
    is_private: Boolean(boardData.is_private),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('boards')
    .insert([payload])
    .select()
    .single()

  if (error) {
    console.error('Error creating board:', error)
    throw new Error(error.message)
  }

  return data
}

/**
 * Fetch all boards belonging to a specific user, including pin previews
 * @param {string} userId - UUID
 */
export const fetchUserBoards = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required.')
  }

  if (!isSupabaseConfigured()) {
    return []
  }

  // Fetch boards with joined board_pins and pin images for cover collage
  const { data, error } = await supabase
    .from('boards')
    .select(`
      id,
      user_id,
      name,
      description,
      is_private,
      created_at,
      updated_at,
      board_pins (
        id,
        pin_id,
        created_at,
        pins (
          id,
          image_url,
          title
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user boards:', error)
    throw new Error(error.message)
  }

  // Format to clean structure
  return (data || []).map(board => {
    const pins = (board.board_pins || [])
      .map(bp => bp.pins)
      .filter(Boolean)

    return {
      id: board.id,
      userId: board.user_id,
      name: board.name,
      description: board.description,
      isPrivate: board.is_private,
      createdAt: board.created_at,
      updatedAt: board.updated_at,
      pinCount: pins.length,
      coverImages: pins.slice(0, 3).map(p => p.image_url),
      pinIds: (board.board_pins || []).map(bp => bp.pin_id)
    }
  })
}

/**
 * Fetch a single board by its UUID
 * @param {string} boardId - UUID
 */
export const fetchBoardById = async (boardId) => {
  if (!boardId) {
    throw new Error('Board ID is required.')
  }

  if (!isSupabaseConfigured()) {
    return null
  }

  const { data, error } = await supabase
    .from('boards')
    .select(`
      id,
      user_id,
      name,
      description,
      is_private,
      created_at,
      updated_at,
      profiles:user_id (
        id,
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('id', boardId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    console.error('Error fetching board by ID:', error)
    throw new Error(error.message)
  }

  return data
}

/**
 * Update a board (only board owner permitted by RLS)
 * @param {string} boardId - UUID
 * @param {object} updates - Fields to update
 */
export const updateBoard = async (boardId, updates) => {
  if (!boardId) {
    throw new Error('Board ID is required to update.')
  }

  if (!isSupabaseConfigured()) {
    return updates
  }

  const payload = {
    ...updates,
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('boards')
    .update(payload)
    .eq('id', boardId)
    .select()
    .single()

  if (error) {
    console.error('Error updating board:', error)
    throw new Error(error.message)
  }

  return data
}

/**
 * Delete a board by ID (cascades to board_pins)
 * @param {string} boardId - UUID
 */
export const deleteBoard = async (boardId) => {
  if (!boardId) {
    throw new Error('Board ID is required to delete.')
  }

  if (!isSupabaseConfigured()) {
    return true
  }

  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', boardId)

  if (error) {
    console.error('Error deleting board:', error)
    throw new Error(error.message)
  }

  return true
}

/**
 * Save a pin to a board with duplicate prevention
 * @param {string} boardId - UUID
 * @param {string} pinId - UUID
 */
export const savePinToBoard = async (boardId, pinId) => {
  if (!boardId || !pinId) {
    throw new Error('Board ID and Pin ID are required.')
  }

  if (!isSupabaseConfigured()) {
    return { success: true }
  }

  // Check if already in board to prevent duplicate
  const { data: existing } = await supabase
    .from('board_pins')
    .select('id')
    .eq('board_id', boardId)
    .eq('pin_id', pinId)
    .maybeSingle()

  if (existing) {
    return { alreadySaved: true, data: existing }
  }

  const { data, error } = await supabase
    .from('board_pins')
    .insert([
      {
        board_id: boardId,
        pin_id: pinId,
        created_at: new Date().toISOString()
      }
    ])
    .select()
    .single()

  if (error) {
    // Check if unique constraint violation
    if (error.code === '23505') {
      return { alreadySaved: true }
    }
    console.error('Error saving pin to board:', error)
    throw new Error(error.message)
  }

  return { success: true, data }
}

/**
 * Remove a pin from a board
 * @param {string} boardId - UUID
 * @param {string} pinId - UUID
 */
export const removePinFromBoard = async (boardId, pinId) => {
  if (!boardId || !pinId) {
    throw new Error('Board ID and Pin ID are required.')
  }

  if (!isSupabaseConfigured()) {
    return true
  }

  const { error } = await supabase
    .from('board_pins')
    .delete()
    .eq('board_id', boardId)
    .eq('pin_id', pinId)

  if (error) {
    console.error('Error removing pin from board:', error)
    throw new Error(error.message)
  }

  return true
}

/**
 * Fetch all pins belonging to a board
 * @param {string} boardId - UUID
 */
export const fetchBoardPins = async (boardId) => {
  if (!boardId) {
    throw new Error('Board ID is required.')
  }

  if (!isSupabaseConfigured()) {
    return []
  }

  const { data, error } = await supabase
    .from('board_pins')
    .select(`
      id,
      created_at,
      pin:pin_id (
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
        profiles:user_id (
          id,
          username,
          full_name,
          avatar_url
        )
      )
    `)
    .eq('board_id', boardId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching board pins:', error)
    throw new Error(error.message)
  }

  return (data || []).map(bp => bp.pin).filter(Boolean)
}

/**
 * Check which boards of a user contain a specific pin
 * @param {string} pinId - UUID
 * @param {string} userId - UUID
 */
export const fetchBoardsForPin = async (pinId, userId) => {
  if (!pinId || !userId || !isSupabaseConfigured()) {
    return []
  }

  const { data, error } = await supabase
    .from('board_pins')
    .select(`
      board_id,
      boards!inner (
        id,
        user_id
      )
    `)
    .eq('pin_id', pinId)
    .eq('boards.user_id', userId)

  if (error) {
    console.error('Error fetching boards for pin:', error)
    return []
  }

  return (data || []).map(bp => bp.board_id)
}
