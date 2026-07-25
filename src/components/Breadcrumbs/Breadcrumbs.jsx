import { Link } from 'react-router-dom'

/**
 * Breadcrumbs - clickable trail representing the user's location.
 * Items come from props ({ label, href? }); the last item, or any item
 * without an href, is the current (non-clickable) page.
 */
function Breadcrumbs({ items = [] }) {
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
                <Link to={item.href} className="text-muted hover:text-brand">
                  {item.label}
                </Link>
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
