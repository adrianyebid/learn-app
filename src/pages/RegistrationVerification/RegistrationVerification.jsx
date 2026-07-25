import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { PATHS } from '../../routes/paths'

/**
 * Registration verification step. The user confirms the code sent after
 * registration; a valid (non-empty) code completes the flow and sends them to
 * the login view. Any 6-character code is accepted in this markup stage.
 */
function RegistrationVerification() {
  const navigate = useNavigate()
  const location = useLocation()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const registeredName = location.state?.registration?.firstName

  const handleSubmit = (event) => {
    event.preventDefault()
    if (code.trim().length < 6) {
      setError('Enter the 6-digit code from your email.')
      return
    }
    navigate(PATHS.login)
  }

  return (
    <section className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-line"
      >
        <h1 className="text-2xl font-semibold text-ink">Verify your email</h1>
        <p className="mt-2 text-sm text-muted">
          {registeredName ? `Almost there, ${registeredName}. ` : ''}
          We sent a 6-digit code to your inbox.
        </p>

        <input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          inputMode="numeric"
          maxLength={6}
          placeholder="______"
          className={`mt-6 w-full rounded-lg border px-3 py-2 text-center text-lg tracking-[0.5em] outline-none ${
            error ? 'border-red-500' : 'border-line focus:border-brand'
          }`}
        />
        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

        <div className="mt-6">
          <Button type="submit" fullWidth>
            Verify account
          </Button>
        </div>
      </form>
    </section>
  )
}

export default RegistrationVerification
