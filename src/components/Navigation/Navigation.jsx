import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../routes/paths'

/**
 * Navigation - shared menu driven by the central route list. Uses react-router
 * NavLink so the active item is highlighted automatically from the URL. On
 * mobile (< 600px) it turns into a vertical drawer that slides in from the
 * left; open/close is controlled from outside.
 */
function Navigation({ items = NAV_ITEMS, open = false, onClose }) {
  return (
    <>
      {/* Desktop menu */}
      <nav className="hidden md:block">
        <ul className="flex items-center gap-8">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-brand ${
                    isActive ? 'text-brand' : 'text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${open ? '' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <nav
          className={`absolute left-0 top-0 h-full w-64 bg-white p-6 shadow-xl transition-transform duration-300 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <ul className="flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-brand-light ${
                      isActive ? 'bg-brand-light text-brand' : 'text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Navigation
