/**
 * Validation utilities for PinSpace backend
 */

export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Password is required.' }
  }
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' }
  }
  return { valid: true }
}

export const validateProfileData = (data) => {
  if (!data) return { valid: false, error: 'No data provided.' }

  if (data.username !== undefined) {
    const trimmed = data.username.trim()
    if (trimmed.length < 3 || trimmed.length > 30) {
      return { valid: false, error: 'Username must be between 3 and 30 characters.' }
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
      return { valid: false, error: 'Username can only contain alphanumeric characters and underscores.' }
    }
  }

  if (data.bio !== undefined && data.bio.length > 500) {
    return { valid: false, error: 'Bio must not exceed 500 characters.' }
  }

  if (data.website && data.website.trim().length > 0) {
    try {
      const url = new URL(data.website.startsWith('http') ? data.website : `https://${data.website}`)
      if (!url.hostname.includes('.') || url.hostname.endsWith('.')) {
        return { valid: false, error: 'Please enter a valid website URL.' }
      }
    } catch {
      return { valid: false, error: 'Please enter a valid website URL.' }
    }
  }

  return { valid: true }
}

export const validatePinData = (data) => {
  if (!data) return { valid: false, error: 'No data provided.' }

  if (!data.title || data.title.trim().length === 0) {
    return { valid: false, error: 'Pin title is required.' }
  }
  if (data.title.trim().length > 255) {
    return { valid: false, error: 'Pin title must be under 255 characters.' }
  }
  if (!data.image_url || data.image_url.trim().length === 0) {
    return { valid: false, error: 'Pin image URL or upload is required.' }
  }
  if (!data.user_id) {
    return { valid: false, error: 'User ID is required to create a pin.' }
  }
  return { valid: true }
}

export const validateBoardData = (data) => {
  if (!data) return { valid: false, error: 'No data provided.' }

  if (!data.name || data.name.trim().length === 0) {
    return { valid: false, error: 'Board name is required.' }
  }
  if (data.name.trim().length > 100) {
    return { valid: false, error: 'Board name must be under 100 characters.' }
  }
  if (!data.user_id) {
    return { valid: false, error: 'User ID is required to create a board.' }
  }
  return { valid: true }
}

export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file provided' }
  }
  const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file format. Please upload JPG, PNG, WEBP, or GIF.'
    }
  }
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit.'
    }
  }
  return { valid: true }
}
