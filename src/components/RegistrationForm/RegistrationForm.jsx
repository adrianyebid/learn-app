import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import ReCAPTCHA from 'react-google-recaptcha'
import Button from '../Button/Button'
import { registrationSchema } from '../../validation/schemas'
import { RECAPTCHA_SITE_KEY } from '../../config/recaptcha'
import { getThunkErrorMessage } from '../../utils/getThunkErrorMessage'
import { fetchTrainingTypes } from '../../store/trainingTypesSlice'

/**
 * Registration Form - role-based (Student / Trainer), Formik + Yup
 * validated, guarded by reCAPTCHA. Reports the submitted values up via
 * `onSubmit`; the page owns the actual register API call and what happens
 * with the generated credentials afterwards.
 *
 * Specialization is a combo box sourced from GET /training-types (made
 * public in the backend for exactly this reason — CreateTrainerDTO.specialization
 * must match an existing training type or the API rejects it with a 400).
 */
function RegistrationForm({ initialRole = 'Student', onSubmit }) {
  const dispatch = useDispatch()
  const trainingTypes = useSelector((state) => state.trainingTypes.items)
  const [captchaToken, setCaptchaToken] = useState(null)
  const [captchaError, setCaptchaError] = useState(null)

  useEffect(() => {
    dispatch(fetchTrainingTypes())
  }, [dispatch])

  const formik = useFormik({
    initialValues: {
      role: initialRole,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      address: '',
      specialization: '',
    },
    validationSchema: registrationSchema,
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
        setStatus(getThunkErrorMessage(error, 'Unable to register. Please try again.'))
        setSubmitting(false)
      }
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue, status } =
    formik

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-sm ring-1 ring-line"
    >
      <h2 className="text-2xl font-semibold text-ink">Create your account</h2>

      {status && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{status}</p>}

      {/* Role switch */}
      <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-brand-light p-1">
        {['Student', 'Trainer'].map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setFieldValue('role', r)}
            className={`rounded-md py-2 text-sm font-medium transition-colors ${
              values.role === r ? 'bg-surface text-brand shadow-sm' : 'text-brand/70'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        <Field
          label="First name *"
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.firstName && errors.firstName}
        />
        <Field
          label="Last name *"
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.lastName && errors.lastName}
        />

        {values.role === 'Student' ? (
          <>
            <Field
              label="Date of birth"
              type="date"
              name="dateOfBirth"
              value={values.dateOfBirth}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.dateOfBirth && errors.dateOfBirth}
            />
            <Field
              label="Address"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.address && errors.address}
            />
          </>
        ) : (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Specialization *</span>
            <select
              name="specialization"
              value={values.specialization}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
                touched.specialization && errors.specialization
                  ? 'border-red-500'
                  : 'border-line focus:border-brand'
              }`}
            >
              <option value="">Select…</option>
              {trainingTypes.map((type) => (
                <option key={type.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
            {touched.specialization && errors.specialization && (
              <span className="mt-1 block text-xs text-red-500">{errors.specialization}</span>
            )}
          </label>
        )}
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
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Creating…' : 'Create account'}
        </Button>
      </div>
    </form>
  )
}

function Field({ label, type = 'text', name, value, onChange, onBlur, error }) {
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

export default RegistrationForm
