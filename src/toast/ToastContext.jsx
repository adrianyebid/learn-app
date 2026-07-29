import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AUTO_DISMISS_MS = 4000
const ToastContext = createContext(null)

/**
 * App-wide toast notifications. Mounted once, in RootLayout, so a toast
 * triggered right before a redirect (e.g. "Account deleted" then navigate
 * home) survives the navigation instead of disappearing with the page that
 * triggered it.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const push = useCallback(
    (type, message) => {
      const id = `${Date.now()}-${Math.random()}`
      setToasts((current) => [...current, { id, type, message }])
      setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    },
    [dismiss],
  )

  const notify = useMemo(
    () => ({
      success: (message) => push('success', message),
      error: (message) => push('error', message),
      info: (message) => push('info', message),
    }),
    [push],
  )

  const value = useMemo(() => ({ toasts, notify, dismiss }), [toasts, notify, dismiss])

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

/** Access the toast list/actions from any component inside <ToastProvider>. */
export function useToast() {
  const context = useContext(ToastContext)
  if (context === null) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
