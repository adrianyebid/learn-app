import { useNavigate } from 'react-router-dom'
import JoinUsBox from '../../components/JoinUsBox/JoinUsBox'
import { PATHS } from '../../routes/paths'

const ROLES = [
  {
    role: 'Student',
    description: 'Enroll in courses, track your progress and earn certificates.',
  },
  {
    role: 'Trainer',
    description: 'Share your expertise, build courses and mentor students.',
  },
]

/** Entry point to the registration flow: pick a role, then register. */
function JoinUs() {
  const navigate = useNavigate()

  const startRegistration = () => navigate(PATHS.registration)

  return (
    <section>
      <h1 className="text-2xl font-bold text-ink">Join us</h1>
      <p className="mt-1 text-muted">Choose how you want to get started.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {ROLES.map((option) => (
          <JoinUsBox
            key={option.role}
            role={option.role}
            description={option.description}
            onSelect={startRegistration}
          />
        ))}
      </div>
    </section>
  )
}

export default JoinUs
