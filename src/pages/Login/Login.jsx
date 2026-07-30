import { Link, useLocation, useNavigate } from 'react-router-dom'
import LoginForm from '../../components/LoginForm/LoginForm'
import { useAuth } from '../../auth/AuthContext'
import { PATHS } from '../../routes/paths'

/**
 * Login view. On success it authenticates the session and returns the user to
 * the page they were trying to reach (set by the route guard), defaulting to
 * Home per the login spec.
 */
function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const redirectTo = location.state?.from?.pathname ?? PATHS.home

  const handleSubmit = async (values) => {
    await login(values)
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="flex flex-col items-center">
      <LoginForm onSubmit={handleSubmit} />
      <p className="mt-4 text-sm text-muted">
        No account yet?{' '}
        <Link to={PATHS.registration} className="font-medium text-brand hover:underline">
          Create one
        </Link>
      </p>
    </section>
  )
}

export default Login
