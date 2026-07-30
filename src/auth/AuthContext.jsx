import { useDispatch, useSelector } from 'react-redux'
import { login as loginThunk, logout as logoutThunk } from '../store/authSlice'

/**
 * Thin adapter over the `auth` Redux slice, kept as a hook (not a Context)
 * now that the store itself is the single source of truth. It stays at this
 * file path because every consumer across the app (Header, ProtectedRoute,
 * RootLayout, MyAccount, Login, ...) already imports `useAuth` from here.
 */
export function useAuth() {
  const dispatch = useDispatch()
  const { accessToken, username, role, status, error } = useSelector((state) => state.auth)
  // Require both: a token without a username (e.g. partially-cleared/corrupted
  // localStorage) must read as "logged out", not as a broken half-session
  // that crashes MiniProfile's `user.name[0]`.
  const isAuthenticated = Boolean(accessToken) && Boolean(username)

  return {
    user: isAuthenticated ? { name: username } : null,
    username,
    role,
    isAuthenticated,
    status,
    error,
    login: (credentials) => dispatch(loginThunk(credentials)).unwrap(),
    logout: () => dispatch(logoutThunk()),
  }
}
