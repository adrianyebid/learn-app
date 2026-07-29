import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import { useTheme } from '../../theme/ThemeContext'

/**
 * Mini-profile - opened from the header profile logo. Reveals a small panel
 * with a link to "My Account" and a "Sign Out" action, plus the Night Mode
 * switch that drives the app-wide theme via ThemeContext.
 */
const DEFAULT_USER = { name: 'Camila Torres', email: 'camila.torres@example.com' }

function MiniProfile({ user, onSignOut }) {
  const [open, setOpen] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const displayUser = user ?? DEFAULT_USER

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open profile menu"
        onClick={() => setOpen((o) => !o)}
        className="grid h-10 w-10 place-items-center rounded-full bg-brand-light font-semibold text-brand"
      >
        {displayUser.name[0]}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl bg-surface p-2 shadow-lg ring-1 ring-line">
            <div className="border-b border-line px-3 py-2">
              <p className="text-sm font-semibold text-ink">{displayUser.name}</p>
              {displayUser.email && (
                <p className="text-xs text-muted">{displayUser.email}</p>
              )}
            </div>
            <Link
              to={PATHS.myAccount}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-brand-light"
            >
              My Account
            </Link>

            <label className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink hover:bg-brand-light">
              Night Mode
              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                onClick={toggleTheme}
                className={`relative h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-1 ${
                  isDark ? 'bg-brand' : 'bg-line'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                    isDark ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>

            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onSignOut?.()
              }}
              className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-50"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default MiniProfile
