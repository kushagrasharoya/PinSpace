import { createClient } from '@supabase/supabase-js'

const getEnvVar = (name) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
    return import.meta.env[name]
  }
  if (typeof process !== 'undefined' && process.env && process.env[name]) {
    return process.env[name]
  }
  return ''
}

const rawSupabaseUrl = getEnvVar('VITE_SUPABASE_URL')
const rawSupabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY')

/**
 * Checks if real Supabase credentials have been configured in .env
 */
export const isSupabaseConfigured = () => {
  return Boolean(
    rawSupabaseUrl &&
    rawSupabaseUrl.trim().length > 0 &&
    !rawSupabaseUrl.includes('placeholder') &&
    rawSupabaseAnonKey &&
    rawSupabaseAnonKey.trim().length > 0 &&
    !rawSupabaseAnonKey.includes('placeholder')
  )
}

// Fallback values prevent client initialization crash when credentials are empty in development
const fallbackUrl = 'https://placeholder-project.supabase.co'
const fallbackAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder'

export const supabaseUrl = isSupabaseConfigured() ? rawSupabaseUrl : fallbackUrl
export const supabaseAnonKey = isSupabaseConfigured() ? rawSupabaseAnonKey : fallbackAnonKey

/**
 * Supabase client instance with auto session refresh and persistence
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: typeof window !== 'undefined',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  }
})

export default supabase
