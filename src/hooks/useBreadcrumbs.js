import { useLocation } from 'react-router-dom'
import { LABEL_BY_PATH, PATHS } from '../routes/paths'

/** Turn a path segment such as "my-account" into a readable "My Account". */
function prettify(segment) {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Derive the breadcrumb trail from the current URL. Home is always the root
 * crumb; each subsequent path segment becomes a cumulative, clickable crumb,
 * and the last item is marked as the current (non-clickable) page.
 *
 * Example: /my-account -> Home / My Account
 */
export function useBreadcrumbs() {
  const { pathname } = useLocation()
  const segments = pathname.split('/').filter(Boolean)

  const crumbs = [{ label: 'Home', href: PATHS.home }]

  let cumulativePath = ''
  segments.forEach((segment) => {
    cumulativePath += `/${segment}`
    if (cumulativePath === PATHS.home) return
    crumbs.push({
      label: LABEL_BY_PATH[cumulativePath] ?? prettify(segment),
      href: cumulativePath,
    })
  })

  // The current page is not a link.
  return crumbs.map((crumb, index) =>
    index === crumbs.length - 1 ? { label: crumb.label } : crumb,
  )
}
