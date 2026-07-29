import { useState } from 'react'
import Button from '../Button/Button'

/**
 * Login Form - username/email + password with simple client-side
 * validation (non-empty), an error state and a loading state.
 */
function LoginForm({ onSubmit }) {
  const [values, setValues] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const setField = (name) => (e) =>
    setValues((v) => ({ ...v, [name]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!values.username.trim()) next.username = 'Username is required'
    if (!values.password.trim()) next.password = 'Password is required'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    // Simulated request; real API wiring comes in a later stage.
    setTimeout(() => {
      setLoading(false)
      onSubmit?.(values)
    }, 1200)
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-sm ring-1 ring-line"
    >
      <h2 className="text-2xl font-semibold text-ink">Welcome back</h2>
      <p className="mt-1 text-sm text-muted">Sign in to your account</p>

      <div className="mt-6 space-y-4">
        <Field
          label="Username or email"
          type="text"
          value={values.username}
          onChange={setField('username')}
          error={errors.username}
        />
        <Field
          label="Password"
          type="password"
          value={values.password}
          onChange={setField('password')}
          error={errors.password}
        />
      </div>

      <div className="mt-6">
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Loading…' : 'Sign In'}
        </Button>
      </div>
    </form>
  )
}

function Field({ label, type, value, onChange, error }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
          error ? 'border-red-500 focus:border-red-500' : 'border-line focus:border-brand'
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

export default LoginForm
