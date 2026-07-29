import { createPortal } from 'react-dom'
import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../routes/paths'

/**
 * Navigation - shared menu driven by the central route list. Uses react-router
 * NavLink so the active item is highlighted automatically from the URL. Items
 * flagged `protected` (e.g. My Account) only show once signed in — otherwise
 * an unauthenticated visitor sees a menu link to a page that just bounces
 * them to Login, which reads as a second, confusing "way to sign in". On
 * mobile (< 600px) it turns into a vertical drawer that slides in from the
 * left; open/close is controlled from outside.
 */
function Navigation({ items = NAV_ITEMS, isAuthenticated = false, open = false, onClose }) {
  const visibleItems = items.filter((item) => !item.protected || isAuthenticated)

  return (
    <>
      {/* Desktop menu */}
      <nav className="hidden md:block">
        <ul className="flex items-center gap-4 lg:gap-6">
          {visibleItems.map((item) => (
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

      {/* Mobile drawer: portaled to <body> so it always covers the full
          viewport, regardless of any ancestor (e.g. the header's
          backdrop-blur) that would otherwise create a containing block for
          this "fixed" overlay and trap it inside the header's box. */}
      {createPortal(
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
            className={`absolute top-0 h-full w-64 bg-surface p-6 shadow-xl transition-[left] duration-300 ${
              open ? 'left-0' : 'left-[-16rem]'
            }`}
          >
            <ul className="flex flex-col gap-2">
              {visibleItems.map((item) => (
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
        </div>,
        document.body,
      )}
    </>
  )
}

export default Navigation
