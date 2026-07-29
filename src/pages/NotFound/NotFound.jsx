import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button/Button'
import { PATHS } from '../../routes/paths'

/** 404 view rendered when the URL does not match any predefined route. */
function NotFound() {
  const navigate = useNavigate()

  return (
    <section className="rounded-2xl bg-surface p-12 text-center shadow-sm ring-1 ring-line">
      <p className="font-heading text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-muted">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-6">
        <Button onClick={() => navigate(PATHS.home)}>Back to home</Button>
      </div>
    </section>
  )
}

export default NotFound
