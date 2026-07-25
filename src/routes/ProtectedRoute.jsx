import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { PATHS } from './paths'

/**
 * Route guard. Renders the nested protected routes only when the user is
 * authenticated; otherwise it redirects to the login view and remembers the
 * originally requested location so the user can be sent back after signing in.
 */
function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={PATHS.login} state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
