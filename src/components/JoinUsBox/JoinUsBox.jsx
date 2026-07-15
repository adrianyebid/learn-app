import Button from '../Button/Button'

/**
 * Join Us Box - lets a user pick a registration flow (trainer / student).
 * Content is dynamic through props. Reuses the shared Button component.
 */
function JoinUsBox({
  role = 'Student',
  description = 'Do consectetur proident proident id eiusmod deserunt consequat pariatur ad ex velit do Lorem reprehenderit.',
  onSelect,
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-line">
      <h3 className="text-xl font-semibold text-ink">Register as {role}</h3>
      <p className="mt-3 grow text-sm text-muted">{description}</p>
      <div className="mt-6">
        <Button onClick={() => onSelect?.(role)} fullWidth>
          Register as {role}
        </Button>
      </div>
    </div>
  )
}

export default JoinUsBox
