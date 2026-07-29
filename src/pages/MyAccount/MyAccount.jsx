import { Link, useNavigate } from 'react-router-dom'
import MyAccountList from '../../components/MyAccountList/MyAccountList'
import { PATHS } from '../../routes/paths'
import { useAuth } from '../../auth/AuthContext'
import { useToast } from '../../toast/ToastContext'

// Fields not collected by the (credential-only) login form yet — placeholder
// data until a real API is wired up.
const PLACEHOLDER_DETAILS = {
  email: 'camila.torres@example.com',
  phone: '+57 300 456 7890',
  address: 'Carrera 15 #93-47, Bogotá, Colombia',
}

/** Private dashboard shown only to authenticated users (see the route guard). */
function MyAccount() {
  const { user } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const [firstName, ...rest] = (user?.name || 'Camila Torres').split(' ')
  const account = {
    firstName,
    lastName: rest.join(' ') || 'Torres',
    ...PLACEHOLDER_DETAILS,
  }

  const handleSave = () => {
    notify.success('Profile updated successfully')
  }

  const handleDelete = () => {
    // Route to Home with a pendingLogout flag; RootLayout finishes the
    // actual logout() once we're already there (see the comment on its
    // effect) instead of clearing the session while still on this
    // protected route, which races ProtectedRoute's own redirect.
    navigate(PATHS.home, {
      state: {
        pendingLogout: true,
        toastMessage: 'Your account has been deleted',
      },
    })
  }

  return (
    <section className="flex flex-col items-center">
      <MyAccountList user={account} onSave={handleSave} onDelete={handleDelete} />
      <Link
        to={PATHS.changePassword}
        className="mt-4 text-sm font-medium text-brand hover:underline"
      >
        Change password
      </Link>
    </section>
  )
}

export default MyAccount
