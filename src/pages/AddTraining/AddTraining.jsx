import { useEffect } from 'react'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import DatePicker from '../../components/DatePicker/DatePicker'
import { useAuth } from '../../auth/AuthContext'
import { useToast } from '../../toast/ToastContext'
import { PATHS } from '../../routes/paths'
import { fetchTraineeProfile } from '../../store/traineeSlice'
import { createTraining } from '../../store/trainingsSlice'
import { addTrainingSchema } from '../../validation/schemas'
import { getThunkErrorMessage } from '../../utils/getThunkErrorMessage'

/**
 * Add Training (trainee-only, gated by RoleRoute). The backend derives a
 * training's "type" from the assigned trainer's specialization — there's no
 * separate type field to submit — so the Type field here is a read-only
 * preview of the selected trainer's specialization, not part of the payload.
 */
function AddTraining() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notify } = useToast()
  const { username } = useAuth()
  const myTrainers = useSelector((state) => state.trainee.profile?.trainers ?? [])

  useEffect(() => {
    if (username) dispatch(fetchTraineeProfile(username))
  }, [dispatch, username])

  const formik = useFormik({
    initialValues: { trainingName: '', trainingDate: '', trainerUsername: '', trainingDuration: '' },
    validationSchema: addTrainingSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(null)
      try {
        await dispatch(
          createTraining({
            traineeUsername: username,
            trainerUsername: values.trainerUsername,
            trainingName: values.trainingName,
            trainingDate: values.trainingDate,
            trainingDuration: Number(values.trainingDuration),
          }),
        ).unwrap()
        notify.success('Training added')
        navigate(PATHS.myTrainings)
      } catch (error) {
        setStatus(getThunkErrorMessage(error, 'Unable to add training. Please try again.'))
        setSubmitting(false)
      }
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, isSubmitting, status } =
    formik

  const selectedTrainer = myTrainers.find((trainer) => trainer.username === values.trainerUsername)

  return (
    <section className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-sm ring-1 ring-line"
      >
        <h1 className="text-2xl font-semibold text-ink">Add passed training</h1>

        {status && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{status}</p>}

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Training name</span>
            <input
              name="trainingName"
              value={values.trainingName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass(touched.trainingName && errors.trainingName)}
            />
            {touched.trainingName && errors.trainingName && (
              <span className="mt-1 block text-xs text-red-500">{errors.trainingName}</span>
            )}
          </label>

          <DatePicker
            label="Training date"
            value={values.trainingDate}
            onChange={(value) => setFieldValue('trainingDate', value)}
            error={touched.trainingDate && errors.trainingDate}
          />

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Trainer</span>
            <select
              name="trainerUsername"
              value={values.trainerUsername}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass(touched.trainerUsername && errors.trainerUsername)}
            >
              <option value="">Select a trainer…</option>
              {myTrainers.map((trainer) => (
                <option key={trainer.username} value={trainer.username}>
                  {trainer.firstName} {trainer.lastName}
                </option>
              ))}
            </select>
            {touched.trainerUsername && errors.trainerUsername && (
              <span className="mt-1 block text-xs text-red-500">{errors.trainerUsername}</span>
            )}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Type</span>
            <input
              disabled
              value={selectedTrainer?.specialization ?? ''}
              placeholder="Determined by the selected trainer"
              className="w-full rounded-lg border border-line bg-black/5 px-3 py-2 text-sm text-muted outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Duration (minutes)</span>
            <input
              type="number"
              name="trainingDuration"
              value={values.trainingDuration}
              onChange={handleChange}
              onBlur={handleBlur}
              className={inputClass(touched.trainingDuration && errors.trainingDuration)}
            />
            {touched.trainingDuration && errors.trainingDuration && (
              <span className="mt-1 block text-xs text-red-500">{errors.trainingDuration}</span>
            )}
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={() => navigate(PATHS.myTrainings)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding…' : 'Add'}
          </Button>
        </div>
      </form>
    </section>
  )
}

function inputClass(hasError) {
  return `w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors ${
    hasError ? 'border-red-500 focus:border-red-500' : 'border-line focus:border-brand'
  }`
}

export default AddTraining
