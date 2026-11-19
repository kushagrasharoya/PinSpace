import React, { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    setToast({ id: Date.now(), message, type })
    const timer = setTimeout(() => {
      setToast(null)
    }, duration)
    return () => clearTimeout(timer)
  }, [])

  const hideToast = useCallback(() => {
    setToast(null)
  }, [])

  return (
    <NotificationContext.Provider value={{ showToast, hideToast, toast }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider')
  }
  return context
}
