import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth, validatePassword } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register, isAuthenticated } = useAuth()
  const { showToast } = useNotification()

  const redirectTarget = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTarget])

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!name || !email || !password) {
      setErrorMessage('Please fill in all required fields.')
      return
    }

    const passwordCheck = validatePassword(password)
    if (!passwordCheck.valid) {
      setErrorMessage(passwordCheck.error)
      return
    }

    try {
      setIsSubmitting(true)
      await register({
        name: name.trim(),
        username: username.trim() || name.trim().toLowerCase().replace(/\s+/g, '_'),
        email: email.trim(),
        password
      })
      showToast(`Welcome to PinSpace, ${name.trim()}!`, 'success')
      navigate(redirectTarget, { replace: true })
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please try again.')
      showToast(err.message || 'Registration failed', 'warning')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-pin-gray-200/80 p-8 sm:p-12 max-w-md w-full text-center animate-scale-in">
        
        {/* Brand Icon */}
        <div className="w-12 h-12 rounded-full bg-pin-red text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <span className="font-black text-2xl">P</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-pin-gray-950 tracking-tight">
          Join PinSpace
        </h1>
        <p className="text-xs sm:text-sm text-pin-gray-500 mt-1 mb-6">
          Discover ideas that inspire your creativity
        </p>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              disabled={isSubmitting}
              placeholder="e.g. Maya Chen"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium transition-all disabled:bg-pin-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              disabled={isSubmitting}
              placeholder="e.g. mayachen"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium transition-all disabled:bg-pin-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              disabled={isSubmitting}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium transition-all disabled:bg-pin-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-1.5">
              Password (min 6 chars)
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isSubmitting}
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium transition-all pr-10 disabled:bg-pin-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-pin-gray-400 hover:text-pin-gray-700 p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-full bg-pin-red hover:bg-pin-redHover text-white font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Continue</span>
              )}
            </button>
          </div>
        </form>

        <p className="text-[11px] text-pin-gray-400 mt-4 leading-relaxed">
          By continuing, you agree to PinSpace's Terms of Service and acknowledge that you've read our Privacy Policy.
        </p>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-pin-gray-500">
          <span>Already have an account? </span>
          <Link to="/login" className="font-bold text-pin-red hover:underline">
            Log in
          </Link>
        </div>

      </div>
    </div>
  )
}
