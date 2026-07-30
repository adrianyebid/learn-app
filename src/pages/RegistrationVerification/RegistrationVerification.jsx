import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { PATHS } from '../../routes/paths'

/**
 * Post-registration success screen. The backend generates the account's
 * username/password itself (there's no user-chosen password or
 * email-verification step in this domain) — this is where they're revealed,
 * replacing the earlier markup stage's fake "enter a 6-digit code" step.
 */
function RegistrationVerification() {
  const location = useLocation()
  const navigate = useNavigate()
  const registration = location.state?.registration

  if (!registration) {
    return <Navigate to={PATHS.registration} replace />
  }

  return (
    <section className="flex justify-center">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-8 text-center shadow-sm ring-1 ring-line">
        <h1 className="text-2xl font-semibold text-ink">You're all set!</h1>
        <p className="mt-2 text-sm text-muted">Save these credentials — you'll need them to sign in.</p>

        <dl className="mt-6 space-y-3 text-left">
          <Credential label="Username" value={registration.username} />
          <Credential label="Password" value={registration.password} />
        </dl>

        <div className="mt-6">
          <Button fullWidth onClick={() => navigate(PATHS.login)}>
            Continue to Sign In
          </Button>
        </div>
      </div>
    </section>
  )
}

function Credential({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-brand-light px-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-mono text-sm font-semibold text-ink">{value}</dd>
    </div>
  )
}

export default RegistrationVerification
