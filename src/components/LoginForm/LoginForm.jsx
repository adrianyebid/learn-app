import { useState } from 'react'
import { useFormik } from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'
import Button from '../Button/Button'
import { loginSchema } from '../../validation/schemas'
import { RECAPTCHA_SITE_KEY } from '../../config/recaptcha'
import { getThunkErrorMessage } from '../../utils/getThunkErrorMessage'

/**
 * Login Form - username/email + password, Formik-driven validation, plus a
 * reCAPTCHA check that must pass before the API call fires.
 */
function LoginForm({ onSubmit }) {
  const [captchaToken, setCaptchaToken] = useState(null)
  const [captchaError, setCaptchaError] = useState(null)

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      if (!captchaToken) {
        setCaptchaError('Please confirm you are not a robot')
        setSubmitting(false)
        return
      }
      setCaptchaError(null)
      setStatus(null)
      try {
        await onSubmit?.(values)
      } catch (error) {
        setStatus(getThunkErrorMessage(error, 'Unable to sign in. Please try again.'))
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-sm ring-1 ring-line"
    >
      <h2 className="text-2xl font-semibold text-ink">Welcome back</h2>
      <p className="mt-1 text-sm text-muted">Sign in to your account</p>

      {formik.status && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{formik.status}</p>
      )}

      <div className="mt-6 space-y-4">
        <Field
          label="Username or email"
          type="text"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && formik.errors.username}
        />
        <Field
          label="Password"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && formik.errors.password}
        />
      </div>

      <div className="mt-4">
        <ReCAPTCHA
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={(token) => {
            setCaptchaToken(token)
            setCaptchaError(null)
          }}
          onExpired={() => setCaptchaToken(null)}
        />
        {captchaError && <span className="mt-1 block text-xs text-red-500">{captchaError}</span>}
      </div>

      <div className="mt-6">
        <Button type="submit" fullWidth disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Loading…' : 'Sign In'}
        </Button>
      </div>
    </form>
  )
}

function Field({ label, type, name, value, onChange, onBlur, error }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
          error ? 'border-red-500 focus:border-red-500' : 'border-line focus:border-brand'
        }`}
      />
      {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
    </label>
  )
}

export default LoginForm
