import React from 'react'
import { useNotification } from '../../context/NotificationContext'
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react'

export default function Toast() {
  const { toast, hideToast } = useNotification()

  if (!toast) return null

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
      case 'info':
      default:
        return <Info className="w-5 h-5 text-sky-400 shrink-0" />
    }
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up pointer-events-auto">
      <div className="flex items-center gap-3 bg-pin-gray-900 text-white px-5 py-3 rounded-full shadow-2xl border border-white/10 backdrop-blur-md">
        {getIcon()}
        <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
        <button
          onClick={hideToast}
          className="ml-2 text-pin-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
