import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import DatePicker from '../../components/DatePicker/DatePicker'
import Table from '../../components/Table/Table'
import { useAuth } from '../../auth/AuthContext'
import { PATHS } from '../../routes/paths'
import { fetchTraineeProfile, searchTraineeTrainings } from '../../store/traineeSlice'
import { fetchTrainerTrainees, searchTrainerTrainings } from '../../store/trainerSlice'
import { fetchTrainingTypes } from '../../store/trainingTypesSlice'

const TRAINEE_COLUMNS = [
  { key: 'trainingDate', label: 'Date' },
  { key: 'trainingName', label: 'Training name' },
  { key: 'trainingType', label: 'Type' },
  { key: 'trainerName', label: "Trainer's name" },
  { key: 'trainingDuration', label: 'Duration' },
]

const TRAINER_COLUMNS = [
  { key: 'trainingDate', label: 'Date' },
  { key: 'trainingName', label: 'Training name' },
  { key: 'trainingType', label: 'Type' },
  { key: 'traineeName', label: "Trainee's name" },
  { key: 'trainingDuration', label: 'Duration' },
]

const EMPTY_FILTERS = { periodFrom: '', periodTo: '', trainerUsername: '', trainingType: '', traineeUsername: '' }

/**
 * Personal training log (protected). The search form and result columns
 * differ by role: trainees filter by trainer/specialization/date, trainers
 * filter by trainee/date. Name filters are selects bound to the user's own
 * trainers/trainees (the backend filters by exact username, not free text).
 */
function MyTrainings() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { username, role } = useAuth()
  const isTrainee = role === 'ROLE_TRAINEE'

  const myTrainers = useSelector((state) => state.trainee.profile?.trainers ?? [])
  const myTrainees = useSelector((state) => state.trainer.trainees)
  const trainingTypes = useSelector((state) => state.trainingTypes.items)
  const trainings = useSelector((state) => (isTrainee ? state.trainee.trainings : state.trainer.trainings))
  const status = useSelector((state) => (isTrainee ? state.trainee.trainingsStatus : state.trainer.trainingsStatus))

  const [filters, setFilters] = useState(EMPTY_FILTERS)

  useEffect(() => {
    if (!username) return
    if (isTrainee) {
      dispatch(fetchTraineeProfile(username))
      dispatch(searchTraineeTrainings({ username }))
    } else {
      dispatch(fetchTrainerTrainees(username))
      dispatch(searchTrainerTrainings({ username }))
    }
    dispatch(fetchTrainingTypes())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, username, isTrainee])

  const setField = (name) => (event) => setFilters((current) => ({ ...current, [name]: event.target.value }))

  const handleSearch = (event) => {
    event.preventDefault()
    if (isTrainee) {
      dispatch(
        searchTraineeTrainings({
          username,
          periodFrom: filters.periodFrom,
          periodTo: filters.periodTo,
          trainerUsername: filters.trainerUsername,
          trainingType: filters.trainingType,
        }),
      )
    } else {
      dispatch(
        searchTrainerTrainings({
          username,
          periodFrom: filters.periodFrom,
          periodTo: filters.periodTo,
          traineeUsername: filters.traineeUsername,
        }),
      )
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Trainings</h1>
        {isTrainee && <Button onClick={() => navigate(PATHS.addTraining)}>Add training</Button>}
      </div>

      <form
        onSubmit={handleSearch}
        className="mt-6 grid gap-4 rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4"
      >
        {isTrainee ? (
          <>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink">Trainer name</span>
              <select
                value={filters.trainerUsername}
                onChange={setField('trainerUsername')}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
              >
                <option value="">Any trainer</option>
                {myTrainers.map((trainer) => (
                  <option key={trainer.username} value={trainer.username}>
                    {trainer.firstName} {trainer.lastName}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink">Specialization</span>
              <select
                value={filters.trainingType}
                onChange={setField('trainingType')}
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
              >
                <option value="">Any type</option>
                {trainingTypes.map((type) => (
                  <option key={type.id} value={type.name}>
                    {type.name}
                  </option>
                ))}
              </select>
            </label>
          </>
        ) : (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Trainee name</span>
            <select
              value={filters.traineeUsername}
              onChange={setField('traineeUsername')}
              className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
            >
              <option value="">Any trainee</option>
              {myTrainees.map((trainee) => (
                <option key={trainee.username} value={trainee.username}>
                  {trainee.firstName} {trainee.lastName}
                </option>
              ))}
            </select>
          </label>
        )}

        <DatePicker
          label="From"
          value={filters.periodFrom}
          onChange={(value) => setFilters((current) => ({ ...current, periodFrom: value }))}
        />
        <DatePicker
          label="To"
          value={filters.periodTo}
          onChange={(value) => setFilters((current) => ({ ...current, periodTo: value }))}
        />

        <div className="flex items-end">
          <Button type="submit" fullWidth>
            Search
          </Button>
        </div>
      </form>

      <div className="mt-6">
        {status === 'loading' ? (
          <p className="text-sm text-muted">Loading trainings…</p>
        ) : (
          <Table columns={isTrainee ? TRAINEE_COLUMNS : TRAINER_COLUMNS} rows={trainings} />
        )}
      </div>
    </section>
  )
}

export default MyTrainings
