import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { validateImageFile } from '../lib/validation'

export { validateImageFile }

const PIN_BUCKET = 'pin-images'

/**
 * Upload pin image to Supabase Storage
 * @param {File} file - The file object from input or dropzone
 * @param {string} userId - UUID of the authenticated user
 * @returns {Promise<{ publicUrl: string, path: string }>}
 */
export const uploadPinImage = async (file, userId) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase credentials are not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
  }

  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  if (!userId) {
    throw new Error('User ID is required to upload an image.')
  }

  // Clean filename and create user-scoped directory path
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  const filePath = `${userId}/${Date.now()}-${sanitizedName}`

  const { data, error } = await supabase.storage
    .from(PIN_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (error) {
    console.error('Storage upload error:', error)
    throw new Error(error.message || 'Failed to upload image.')
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from(PIN_BUCKET)
    .getPublicUrl(data.path)

  return {
    path: data.path,
    publicUrl: urlData.publicUrl
  }
}

/**
 * Delete image from Supabase Storage
 * @param {string} filePath - Storage path inside the bucket
 */
export const deletePinImage = async (filePath) => {
  if (!isSupabaseConfigured() || !filePath) return

  const { error } = await supabase.storage
    .from(PIN_BUCKET)
    .remove([filePath])

  if (error) {
    console.error('Storage delete error:', error)
    throw new Error(error.message)
  }
}
