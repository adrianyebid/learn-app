import { useState } from 'react'
import Button from '../Button/Button'

/**
 * Registration Form - role-based (Student / Trainer). Fields and validation
 * rules adapt to the selected role. On success it reveals a generated
 * username + password (hidden until the response arrives).
 */
const SPECIALIZATIONS = ['Frontend', 'Backend', 'DevOps', 'Design', 'QA']

function RegistrationForm({ onSubmit }) {
  const [role, setRole] = useState('Student')
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    specialization: '',
  })
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)

  const setField = (name) => (e) =>
    setValues((v) => ({ ...v, [name]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!values.firstName.trim()) next.firstName = 'First name is required'
    if (!values.lastName.trim()) next.lastName = 'Last name is required'
    if (role === 'Trainer' && !values.specialization)
      next.specialization = 'Specialization is required'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return

    // Simulated positive API response with generated credentials.
    const generated = {
      username: `${values.firstName}.${values.lastName}`.toLowerCase(),
      password: Math.random().toString(36).slice(2, 10),
    }
    setResult(generated)
    onSubmit?.({ role, ...values })
  }

  if (result) {
    return (
      <div className="w-full max-w-md rounded-2xl bg-surface p-8 text-center shadow-sm ring-1 ring-line">
        <h2 className="text-2xl font-semibold text-ink">You're all set! 🎉</h2>
        <p className="mt-1 text-sm text-muted">Use these credentials to log in.</p>
        <dl className="mt-6 space-y-3 text-left">
          <Credential label="Username" value={result.username} />
          <Credential label="Password" value={result.password} />
        </dl>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-sm ring-1 ring-line"
    >
      <h2 className="text-2xl font-semibold text-ink">Create your account</h2>

      {/* Role switch */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-brand-light p-1">
        {['Student', 'Trainer'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              role === r ? 'bg-surface text-brand shadow-sm' : 'text-brand/70'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <Field label="First name *" value={values.firstName} onChange={setField('firstName')} error={errors.firstName} />
        <Field label="Last name *" value={values.lastName} onChange={setField('lastName')} error={errors.lastName} />

        {role === 'Student' ? (
          <>
            <Field label="Date of birth" type="date" value={values.dob} onChange={setField('dob')} />
            <Field label="Address" value={values.address} onChange={setField('address')} />
          </>
        ) : (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Specialization *</span>
            <select
              value={values.specialization}
              onChange={setField('specialization')}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                errors.specialization ? 'border-red-500' : 'border-line focus:border-brand'
              }`}
            >
              <option value="">Select…</option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {errors.specialization && (
              <span className="mt-1 block text-xs text-red-500">{errors.specialization}</span>
            )}
          </label>
        )}
      </div>

      <div className="mt-6">
        <Button type="submit" fullWidth>Create account</Button>
      </div>
    </form>
  )
}

function Field({ label, type = 'text', value, onChange, error }) {
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

function Credential({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-brand-light px-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-mono text-sm font-semibold text-ink">{value}</dd>
    </div>
  )
}

export default RegistrationForm
