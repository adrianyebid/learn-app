import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import MyAccountList from '../../components/MyAccountList/MyAccountList'
import { PATHS } from '../../routes/paths'
import { useAuth } from '../../auth/AuthContext'
import { useToast } from '../../toast/ToastContext'
import { fetchTraineeProfile, updateTraineeProfile, deleteTraineeAccount } from '../../store/traineeSlice'
import { fetchTrainerProfile, updateTrainerProfile, deleteTrainerAccount } from '../../store/trainerSlice'
import { getThunkErrorMessage } from '../../utils/getThunkErrorMessage'

/** Private dashboard shown only to authenticated users (see the route guard). */
function MyAccount() {
  const { username, role } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isTrainee = role === 'ROLE_TRAINEE'

  const traineeProfile = useSelector((state) => state.trainee.profile)
  const trainerProfile = useSelector((state) => state.trainer.profile)
  const profile = isTrainee ? traineeProfile : trainerProfile

  useEffect(() => {
    if (!username) return
    if (isTrainee) dispatch(fetchTraineeProfile(username))
    else dispatch(fetchTrainerProfile(username))
  }, [dispatch, username, isTrainee])

  if (!profile) {
    return <p className="text-center text-sm text-muted">Loading your account…</p>
  }

  const handleSave = async (values) => {
    try {
      const payload = isTrainee
        ? {
            username,
            firstName: values.firstName,
            lastName: values.lastName,
            dateOfBirth: values.dateOfBirth || undefined,
            address: values.address || undefined,
            isActive: values.isActive,
          }
        : { username, firstName: values.firstName, lastName: values.lastName, isActive: values.isActive }

      if (isTrainee) await dispatch(updateTraineeProfile(payload)).unwrap()
      else await dispatch(updateTrainerProfile(payload)).unwrap()
      notify.success('Profile updated successfully')
    } catch (error) {
      notify.error(getThunkErrorMessage(error, 'Unable to update profile'))
    }
  }

  const handleDelete = async () => {
    try {
      if (isTrainee) await dispatch(deleteTraineeAccount(username)).unwrap()
      else await dispatch(deleteTrainerAccount(username)).unwrap()
      // See RootLayout's pendingLogout effect: navigate to the public
      // destination first, the session is only cleared once we're there.
      navigate(PATHS.home, {
        state: { pendingLogout: true, toastMessage: 'Your account has been deleted' },
      })
    } catch (error) {
      notify.error(getThunkErrorMessage(error, 'Unable to delete account'))
    }
  }

  return (
    <section className="flex flex-col items-center">
      <MyAccountList
        profile={{ ...profile, username }}
        role={role}
        onSave={handleSave}
        onDelete={handleDelete}
        onAddTrainer={() => navigate(PATHS.addTrainer)}
      />
      <div className="mt-4 flex items-center gap-4 text-sm">
        <Link to={PATHS.changePassword} className="font-medium text-brand hover:underline">
          Change password
        </Link>
        <Link to={PATHS.myTrainings} className="font-medium text-brand hover:underline">
          View trainings
        </Link>
      </div>
    </section>
  )
}

export default MyAccount
