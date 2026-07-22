import { createContext, useContext, useMemo, useState } from 'react'

/**
 * Minimal authentication context. It only tracks whether a user is signed in
 * so the route guard can protect private views; real credential handling is
 * out of scope for the routing task. State lives in memory for the session.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      login: (nextUser = { name: 'Jane Cooper' }) => setUser(nextUser),
      logout: () => setUser(null),
    }),
    [user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Access the auth state/actions from any component inside <AuthProvider>. */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
