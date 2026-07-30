import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'
import { registerTrainee, registerTrainer } from '../../store/authSlice'
import { PATHS } from '../../routes/paths'

/**
 * Registration view. Dispatches the real register call (trainee or trainer,
 * per the selected role) and forwards the backend-generated credentials to
 * the verification/success step via navigation state.
 */
function Registration() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const initialRole = location.state?.role === 'Trainer' ? 'Trainer' : 'Student'

  const handleSubmit = async (values) => {
    const { role, firstName, lastName, dateOfBirth, address, specialization } = values

    const result =
      role === 'Trainer'
        ? await dispatch(registerTrainer({ firstName, lastName, specialization })).unwrap()
        : await dispatch(
            registerTrainee({
              firstName,
              lastName,
              dateOfBirth: dateOfBirth || undefined,
              address: address || undefined,
            }),
          ).unwrap()

    navigate(PATHS.registrationVerification, { state: { registration: result } })
  }

  return (
    <section className="flex justify-center">
      <RegistrationForm initialRole={initialRole} onSubmit={handleSubmit} />
    </section>
  )
}

export default Registration
