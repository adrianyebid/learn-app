import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import Toaster from '../components/Toaster/Toaster'
import { useAuth } from '../auth/AuthContext'
import { useToast } from '../toast/ToastContext'
import { useBreadcrumbs } from '../hooks/useBreadcrumbs'
import { PATHS } from '../routes/paths'

/**
 * Shared shell for every page. The Header/Footer stay mounted while the
 * <Outlet> swaps the active page, and the breadcrumbs reflect the nested
 * location. This layout route is what makes the routing "nested".
 */
function RootLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, logout, user } = useAuth()
  const { toasts, dismiss, notify } = useToast()
  const breadcrumbs = useBreadcrumbs()

  // Finalizes a sign-out/delete requested by a *protected* page. Clearing
  // the session there and then navigating races ProtectedRoute's own
  // redirect: it can still render once more against the (about to be
  // stale) protected path with isAuthenticated already false, and its
  // <Navigate to="/login"> wins over the "/home" we asked for. Routing
  // there first with a `pendingLogout` flag and finishing the logout only
  // once we're already on the public destination sidesteps the race
  // entirely — ProtectedRoute has fully unmounted by the time this runs.
  useEffect(() => {
    if (!location.state?.pendingLogout) return
    logout()
    if (location.state.toastMessage) notify.success(location.state.toastMessage)
    navigate(location.pathname, { replace: true, state: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  const handleSignOut = () => {
    navigate(PATHS.home, { state: { pendingLogout: true } })
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        onSignIn={() => navigate(PATHS.login)}
        onJoinUs={() => navigate(PATHS.joinUs)}
        onSignOut={handleSignOut}
      />

      <main className="mx-auto w-full max-w-6xl grow px-4 py-8">
        <div className="flex items-center justify-between">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="mt-6">
          <Outlet />
        </div>
      </main>

      <Footer />
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </div>
  )
}

export default RootLayout
