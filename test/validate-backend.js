// Backend validation test suite for PinSpace Supabase implementation
import {
  validatePassword,
  validatePinData,
  validateBoardData,
  validateProfileData,
  validateImageFile
} from '../src/lib/validation.js'
import { isSupabaseConfigured, supabase } from '../src/lib/supabase.js'

let passedTests = 0
let failedTests = 0

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`)
    passedTests++
  } else {
    console.error(`[FAIL] ${testName}`)
    failedTests++
  }
}

console.log('==================================================')
console.log('PinSpace Backend & Validation Test Suite')
console.log('==================================================\n')

// 1. Password Validation Tests
console.log('1. Authentication & Password Validation:')
assert(validatePassword('').valid === false, 'Rejects empty password')
assert(validatePassword('12345').valid === false, 'Rejects password shorter than 6 characters')
assert(validatePassword('123456').valid === true, 'Accepts 6 character password')
assert(validatePassword('StrongSecurePassword123!').valid === true, 'Accepts complex password')

// 2. Profile Validation Tests
console.log('\n2. User Profile Validation:')
assert(validateProfileData({ username: 'ab' }).valid === false, 'Rejects username with < 3 characters')
assert(validateProfileData({ username: 'valid_user_123' }).valid === true, 'Accepts valid alphanumeric username with underscores')
assert(validateProfileData({ username: 'invalid user!' }).valid === false, 'Rejects username with spaces or special symbols')
assert(validateProfileData({ website: 'not-a-website' }).valid === false, 'Rejects invalid website format')
assert(validateProfileData({ website: 'https://ariasterling.design' }).valid === true, 'Accepts valid HTTPS URL')
assert(validateProfileData({ bio: 'a'.repeat(600) }).valid === false, 'Rejects bio exceeding 500 characters')

// 3. Pin Validation Tests
console.log('\n3. Pin CRUD & Input Validation:')
assert(validatePinData({ title: '', image_url: 'https://example.com/pic.jpg', user_id: 'uuid-1' }).valid === false, 'Rejects empty pin title')
assert(validatePinData({ title: 'Modern Villa', image_url: '', user_id: 'uuid-1' }).valid === false, 'Rejects empty image URL')
assert(validatePinData({ title: 'Modern Villa', image_url: 'https://example.com/pic.jpg', user_id: '' }).valid === false, 'Rejects missing user_id (foreign key safety)')
assert(validatePinData({
  title: 'Minimalist Loft',
  image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
  user_id: '123e4567-e89b-12d3-a456-426614174000'
}).valid === true, 'Accepts complete valid pin data')

// 4. Board Validation Tests
console.log('\n4. Board Management & Validation:')
assert(validateBoardData({ name: '', user_id: 'uuid-1' }).valid === false, 'Rejects empty board name')
assert(validateBoardData({ name: 'Dream Living Room', user_id: '' }).valid === false, 'Rejects missing board owner user_id')
assert(validateBoardData({
  name: 'Dream Living Room',
  user_id: '123e4567-e89b-12d3-a456-426614174000',
  description: 'Nordic and Japandi inspiration',
  is_private: true
}).valid === true, 'Accepts valid board with privacy settings')

// 5. Storage & Image File Validation Tests
console.log('\n5. Storage Image Validation:')
assert(validateImageFile(null).valid === false, 'Rejects null file')
assert(validateImageFile({ type: 'application/pdf', size: 1024 }).valid === false, 'Rejects non-image mime type (e.g. PDF)')
assert(validateImageFile({ type: 'image/jpeg', size: 15 * 1024 * 1024 }).valid === false, 'Rejects file > 10MB limit')
assert(validateImageFile({ type: 'image/png', size: 2 * 1024 * 1024 }).valid === true, 'Accepts valid PNG within size limit')
assert(validateImageFile({ type: 'image/webp', size: 500 * 1024 }).valid === true, 'Accepts valid WEBP image')

// 6. Supabase Client Configuration Check
console.log('\n6. Supabase Client Architecture Check:')
const configured = isSupabaseConfigured()
console.log(`Supabase Live Connection Configured: ${configured}`)
assert(typeof supabase.from === 'function', 'Supabase client instance is initialized and exposes .from()')
assert(typeof supabase.auth.signUp === 'function', 'Supabase Auth exposes signUp()')
assert(typeof supabase.auth.signInWithPassword === 'function', 'Supabase Auth exposes signInWithPassword()')
assert(typeof supabase.storage.from === 'function', 'Supabase Storage exposes .from()')

console.log('\n==================================================')
console.log(`Summary: ${passedTests} Passed, ${failedTests} Failed`)
console.log('==================================================')

if (failedTests > 0) {
  process.exit(1)
} else {
  process.exit(0)
}
