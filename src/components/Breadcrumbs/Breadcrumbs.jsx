/**
 * Breadcrumbs - clickable trail representing the user's location.
 * Items come from props; the last item is the current (non-clickable) page.
 */
const DEFAULT = [
  { label: 'Home', href: '#' },
  { label: 'My Account', href: '#' },
  { label: 'Edit Profile' },
]

function Breadcrumbs({ items = DEFAULT }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-2">
              {last || !item.href ? (
                <span className="font-medium text-ink" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="text-muted hover:text-brand">
                  {item.label}
                </a>
              )}
              {!last && <span className="text-muted">/</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
