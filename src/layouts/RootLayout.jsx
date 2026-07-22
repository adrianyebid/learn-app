import { Outlet, useNavigate } from 'react-router-dom'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs'
import MiniProfile from '../components/MiniProfile/MiniProfile'
import { useAuth } from '../auth/AuthContext'
import { useBreadcrumbs } from '../hooks/useBreadcrumbs'
import { PATHS } from '../routes/paths'

/**
 * Shared shell for every page. The Header/Footer stay mounted while the
 * <Outlet> swaps the active page, and the breadcrumbs reflect the nested
 * location. This layout route is what makes the routing "nested".
 */
function RootLayout() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const breadcrumbs = useBreadcrumbs()

  const handleSignOut = () => {
    logout()
    navigate(PATHS.home)
  }

  return (
    <div className="flex min-h-full flex-col">
      <Header
        onSignIn={() => navigate(PATHS.login)}
        onJoinUs={() => navigate(PATHS.joinUs)}
      />

      <main className="mx-auto w-full max-w-6xl grow px-4 py-8">
        <div className="flex items-center justify-between">
          <Breadcrumbs items={breadcrumbs} />
          {isAuthenticated && <MiniProfile onSignOut={handleSignOut} />}
        </div>

        <div className="mt-6">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default RootLayout
