import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { PATHS } from '../../routes/paths'
import { useToast } from '../../toast/ToastContext'
import { changePassword } from '../../store/authSlice'
import { changePasswordSchema } from '../../validation/schemas'
import { getThunkErrorMessage } from '../../utils/getThunkErrorMessage'

/**
 * Change password view (protected). Validates the new password, confirms it
 * matches, then calls the real change-password endpoint for the signed-in user.
 */
function ChangePassword() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { notify } = useToast()

  const formik = useFormik({
    initialValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
    validationSchema: changePasswordSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(null)
      try {
        await dispatch(
          changePassword({ oldPassword: values.oldPassword, newPassword: values.newPassword }),
        ).unwrap()
        notify.success('Password updated successfully')
        navigate(PATHS.myAccount)
      } catch (error) {
        setStatus(getThunkErrorMessage(error, 'Unable to update password. Please try again.'))
        setSubmitting(false)
      }
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, status } = formik

  return (
    <section className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-sm rounded-2xl bg-surface p-8 shadow-sm ring-1 ring-line"
      >
        <h1 className="text-2xl font-semibold text-ink">Change password</h1>
        <p className="mt-1 text-sm text-muted">Keep your account secure.</p>

        {status && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{status}</p>}

        <div className="mt-6 space-y-4">
          <Field
            label="Current password"
            name="oldPassword"
            value={values.oldPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.oldPassword && errors.oldPassword}
          />
          <Field
            label="New password"
            name="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.newPassword && errors.newPassword}
          />
          <Field
            label="Confirm new password"
            name="confirmPassword"
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword && errors.confirmPassword}
          />
        </div>

        <div className="mt-6">
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Updating…' : 'Update password'}
          </Button>
        </div>
      </form>
    </section>
  )
}

function Field({ label, name, value, onChange, onBlur, error }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink">{label}</span>
      <input
        type="password"
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

export default ChangePassword
