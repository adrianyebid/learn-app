import { useState } from 'react'
import { useFormik } from 'formik'
import Button from '../Button/Button'
import Modal from '../Modal/Modal'
import Table from '../Table/Table'
import { updateTraineeSchema, updateTrainerSchema } from '../../validation/schemas'

const TRAINER_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'specialization', label: 'Specialization' },
]

/**
 * My Account List - personal dashboard: view/edit profile details (Formik +
 * Yup, schema chosen by role), a delete-account confirmation (Modal), and,
 * for trainees, a read-only "My Trainers" table with a link to add more.
 */
function MyAccountList({ profile, role, onSave, onDelete, onAddTrainer, saving = false }) {
  const [editing, setEditing] = useState(false)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const isTrainee = role === 'ROLE_TRAINEE'

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      dateOfBirth: profile.dateOfBirth ?? '',
      address: profile.address ?? '',
      isActive: profile.isActive ?? true,
    },
    validationSchema: isTrainee ? updateTraineeSchema : updateTrainerSchema,
    onSubmit: async (values) => {
      await onSave?.(values)
      setEditing(false)
    },
  })

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm, isSubmitting } =
    formik

  const cancelEdit = () => {
    resetForm()
    setEditing(false)
  }

  const confirmDelete = () => {
    setConfirmingDelete(false)
    onDelete?.()
  }

  const trainersRows = (profile.trainers ?? []).map((trainer) => ({
    name: `${trainer.firstName} ${trainer.lastName}`,
    specialization: trainer.specialization,
  }))

  return (
    <div className="w-full max-w-lg rounded-2xl bg-surface p-8 shadow-sm ring-1 ring-line">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-light text-lg font-semibold text-brand">
            {profile.firstName?.[0]}
            {profile.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-muted">{profile.username}</p>
          </div>
        </div>
        {!editing && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
            <Button variant="danger" size="sm" onClick={() => setConfirmingDelete(true)}>
              Delete Account
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <dl className="mt-6 divide-y divide-line">
          <Row label="First name" error={touched.firstName && errors.firstName}>
            {editing ? (
              <input
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass(touched.firstName && errors.firstName)}
              />
            ) : (
              profile.firstName
            )}
          </Row>
          <Row label="Last name" error={touched.lastName && errors.lastName}>
            {editing ? (
              <input
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass(touched.lastName && errors.lastName)}
              />
            ) : (
              profile.lastName
            )}
          </Row>

          {isTrainee ? (
            <>
              <Row label="Date of birth" error={touched.dateOfBirth && errors.dateOfBirth}>
                {editing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={values.dateOfBirth ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass(touched.dateOfBirth && errors.dateOfBirth)}
                  />
                ) : (
                  profile.dateOfBirth || '—'
                )}
              </Row>
              <Row label="Address" error={touched.address && errors.address}>
                {editing ? (
                  <input
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass(touched.address && errors.address)}
                  />
                ) : (
                  profile.address || '—'
                )}
              </Row>
            </>
          ) : (
            <Row label="Specialization">{profile.specialization}</Row>
          )}

          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-sm text-muted">Status</dt>
            {editing ? (
              <button
                type="button"
                role="switch"
                aria-checked={values.isActive}
                onClick={() => setFieldValue('isActive', !values.isActive)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  values.isActive ? 'bg-brand' : 'bg-line'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform duration-200 ${
                    values.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            ) : (
              <dd className="text-sm font-medium text-ink">{profile.isActive ? 'Active' : 'Inactive'}</dd>
            )}
          </div>
        </dl>

        {editing && (
          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting || saving}>
              {isSubmitting || saving ? 'Saving…' : 'Save changes'}
            </Button>
          </div>
        )}
      </form>

      {isTrainee && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">My Trainers</h3>
            <Button variant="outline" size="sm" onClick={onAddTrainer}>
              Add trainer
            </Button>
          </div>
          <div className="mt-3">
            <Table columns={TRAINER_COLUMNS} rows={trainersRows} />
          </div>
        </div>
      )}

      <Modal
        open={confirmingDelete}
        title="Delete account"
        onClose={() => setConfirmingDelete(false)}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setConfirmingDelete(false)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={confirmDelete}>
              Delete Account
            </Button>
          </>
        }
      >
        This will permanently delete your account and sign you out. This action cannot be undone.
      </Modal>
    </div>
  )
}

function Row({ label, children, error }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="w-1/2 text-right text-sm font-medium text-ink">
        {children}
        {error && <span className="mt-1 block text-left text-xs text-red-500">{error}</span>}
      </dd>
    </div>
  )
}

function inputClass(hasError) {
  return `w-full rounded-lg border px-3 py-1.5 text-left text-sm outline-none ${
    hasError ? 'border-red-500 focus:border-red-500' : 'border-line focus:border-brand'
  }`
}

export default MyAccountList
