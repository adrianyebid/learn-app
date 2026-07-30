import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import Table from '../../components/Table/Table'
import { useAuth } from '../../auth/AuthContext'
import { useToast } from '../../toast/ToastContext'
import { PATHS } from '../../routes/paths'
import { assignTrainers, fetchTraineeProfile, fetchUnassignedTrainers } from '../../store/traineeSlice'
import { getThunkErrorMessage } from '../../utils/getThunkErrorMessage'

const MY_TRAINERS_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'specialization', label: 'Specialization' },
]

/** Add Trainer (trainee-only, gated by RoleRoute): assign unassigned trainers to your own list. */
function AddTrainer() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notify } = useToast()
  const { username } = useAuth()
  const unassignedTrainers = useSelector((state) => state.trainee.unassignedTrainers)
  const myTrainers = useSelector((state) => state.trainee.profile?.trainers ?? [])
  const [selected, setSelected] = useState([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!username) return
    dispatch(fetchUnassignedTrainers(username))
    dispatch(fetchTraineeProfile(username))
  }, [dispatch, username])

  const toggle = (trainerUsername) => {
    setSelected((current) =>
      current.includes(trainerUsername)
        ? current.filter((value) => value !== trainerUsername)
        : [...current, trainerUsername],
    )
  }

  const handleAdd = async () => {
    if (!selected.length) return
    setSubmitting(true)
    try {
      await dispatch(assignTrainers({ traineeUsername: username, trainerUsernames: selected })).unwrap()
      await Promise.all([
        dispatch(fetchTraineeProfile(username)).unwrap(),
        dispatch(fetchUnassignedTrainers(username)).unwrap(),
      ])
      notify.success('Trainer added')
      setSelected([])
    } catch (error) {
      notify.error(getThunkErrorMessage(error, 'Unable to add trainer'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-bold text-ink">Add trainer</h1>
      <p className="mt-1 text-muted">Please select trainers for adding them into your trainers list.</p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 text-sm font-semibold text-ink">All Trainers</h2>
          <div className="overflow-x-auto rounded-2xl bg-surface shadow-sm ring-1 ring-line">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-light text-brand">
                <tr>
                  <th className="px-4 py-3 font-semibold" aria-hidden="true"></th>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Specialization</th>
                </tr>
              </thead>
              <tbody>
                {unassignedTrainers.map((trainer) => (
                  <tr key={trainer.username} className="border-t border-line hover:bg-brand-light/40">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        aria-label={`Select ${trainer.firstName} ${trainer.lastName}`}
                        checked={selected.includes(trainer.username)}
                        onChange={() => toggle(trainer.username)}
                      />
                    </td>
                    <td className="px-4 py-3 text-ink">
                      {trainer.firstName} {trainer.lastName}
                    </td>
                    <td className="px-4 py-3 text-ink">{trainer.specialization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <Button onClick={handleAdd} disabled={!selected.length || submitting}>
              {submitting ? 'Adding…' : 'Add'}
            </Button>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-semibold text-ink">My Trainers</h2>
          <Table
            columns={MY_TRAINERS_COLUMNS}
            rows={myTrainers.map((trainer) => ({
              name: `${trainer.firstName} ${trainer.lastName}`,
              specialization: trainer.specialization,
            }))}
          />
        </div>
      </div>

      <div className="mt-6">
        <Button variant="ghost" onClick={() => navigate(PATHS.myAccount)}>
          Back to My Account
        </Button>
      </div>
    </section>
  )
}

export default AddTrainer
