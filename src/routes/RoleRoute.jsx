import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { PATHS } from './paths'

/**
 * Wraps a protected page element with an additional role check (e.g. the
 * "Add Training"/"Add Trainer" pages are trainee-only). Sits inside
 * ProtectedRoute's element map, so `role` is always known by the time this
 * renders.
 */
function RoleRoute({ roles, children }) {
  const { role } = useAuth()
  if (!roles.includes(role)) {
    return <Navigate to={PATHS.myAccount} replace />
  }
  return children
}

export default RoleRoute
