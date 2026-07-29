import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'learn-app-theme'
const ThemeContext = createContext(null)

function getInitialIsDark() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return stored === 'dark'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false
}

/**
 * Application-wide theme state ("Night Mode"). Toggling flips a `.dark`
 * class on <html>, which is what index.css's `:root.dark { --color-*: ... }`
 * block and the `@custom-variant dark` selector key off of — so every
 * bg-surface / text-ink utility across the app repaints, not just the
 * component that owns the switch. The choice persists in localStorage.
 */
export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(getInitialIsDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  const value = useMemo(
    () => ({
      isDark,
      toggleTheme: () => setIsDark((d) => !d),
    }),
    [isDark],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/** Access the theme state/actions from any component inside <ThemeProvider>. */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
