import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated } = useAuth()
  const { showToast } = useNotification()

  const redirectTarget = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectTarget])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.')
      return
    }

    try {
      setIsSubmitting(true)
      await login(email, password)
      showToast('Welcome back to PinSpace!', 'success')
      navigate(redirectTarget, { replace: true })
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.')
      showToast(err.message || 'Login failed', 'warning')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async () => {
    try {
      setIsSubmitting(true)
      await login('aria@pinspace.design', 'demo1234')
      showToast('Logged in as Aria Sterling (Curator)', 'success')
      navigate(redirectTarget, { replace: true })
    } catch (err) {
      setErrorMessage(err.message || 'Demo login failed.')
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
          Welcome to PinSpace
        </h1>
        <p className="text-xs sm:text-sm text-pin-gray-500 mt-1 mb-6">
          Find new ideas to try and collect your inspirations
        </p>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Demo Login Shortcut */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={isSubmitting}
          className="w-full mb-6 py-3 px-4 rounded-full bg-pin-lightRed hover:bg-rose-100 text-pin-red font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-pin-red/20 shadow-sm disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>One-Click Demo Sign In (Aria Sterling)</span>
        </button>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-pin-gray-200" />
          <span className="px-3 text-xs font-semibold text-pin-gray-400 uppercase tracking-wider">or with email</span>
          <div className="flex-1 border-t border-pin-gray-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              disabled={isSubmitting}
              placeholder="aria@pinspace.design"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-pin-gray-300 focus:border-pin-red focus:ring-2 focus:ring-pin-lightRed outline-none text-sm font-medium transition-all disabled:bg-pin-gray-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-pin-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isSubmitting}
                placeholder="Enter password"
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
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In</span>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-pin-gray-500">
          <span>Not on PinSpace yet? </span>
          <Link to="/register" className="font-bold text-pin-red hover:underline">
            Sign up
          </Link>
        </div>

      </div>
    </div>
  )
}
