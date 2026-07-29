import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { PATHS } from '../../routes/paths'
import { useToast } from '../../toast/ToastContext'

const EMPTY = { current: '', next: '', confirm: '' }

/**
 * Change password view (protected). Validates that the new password is filled
 * in and matches its confirmation, then returns to My Account.
 */
function ChangePassword() {
  const navigate = useNavigate()
  const { notify } = useToast()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const setField = (name) => (event) =>
    setValues((current) => ({ ...current, [name]: event.target.value }))

  const validate = () => {
    const next = {}
    if (!values.current.trim()) next.current = 'Current password is required'
    if (values.next.trim().length < 8)
      next.next = 'New password must be at least 8 characters'
    if (values.next !== values.confirm)
      next.confirm = 'Passwords do not match'
    return next
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    notify.success('Password updated successfully')
    navigate(PATHS.myAccount)
  }

  return (
    <section className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-sm ring-1 ring-line"
      >
        <h1 className="text-2xl font-semibold text-ink">Change password</h1>
        <p className="mt-1 text-sm text-muted">Keep your account secure.</p>

        <div className="mt-6 space-y-4">
          <Field
            label="Current password"
            value={values.current}
            onChange={setField('current')}
            error={errors.current}
          />
          <Field
            label="New password"
            value={values.next}
            onChange={setField('next')}
            error={errors.next}
          />
          <Field
            label="Confirm new password"
            value={values.confirm}
            onChange={setField('confirm')}
            error={errors.confirm}
          />
        </div>

        <div className="mt-6">
          <Button type="submit" fullWidth>
            Update password
          </Button>
        </div>
      </form>
    </section>
  )
}

function Field({ label, value, onChange, error }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <input
        type="password"
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

export default ChangePassword
