import { useNavigate } from 'react-router-dom'
import RegistrationForm from '../../components/RegistrationForm/RegistrationForm'
import { PATHS } from '../../routes/paths'

/**
 * Registration view. After the form reports success it forwards the generated
 * credentials to the verification step via navigation state.
 */
function Registration() {
  const navigate = useNavigate()

  const handleSubmit = (data) => {
    navigate(PATHS.registrationVerification, { state: { registration: data } })
  }

  return (
    <section className="flex justify-center">
      <RegistrationForm onSubmit={handleSubmit} />
    </section>
  )
}

export default Registration
