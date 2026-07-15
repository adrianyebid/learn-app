import { useState } from 'react'

/**
 * Mini-profile - opened from the header profile logo. Reveals a small panel
 * with a link to "My Account" and a "Sign Out" action. Includes an optional
 * Night Mode toggle (auxiliary, not required for core functionality).
 */
function MiniProfile({ user = { name: 'Jane Cooper', email: 'jane@example.com' }, onSignOut }) {
  const [open, setOpen] = useState(false)
  const [night, setNight] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open profile menu"
        onClick={() => setOpen((o) => !o)}
        className="grid h-10 w-10 place-items-center rounded-full bg-brand-light font-semibold text-brand"
      >
        {user.name[0]}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl bg-white p-2 shadow-lg ring-1 ring-line">
            <div className="border-b border-line px-3 py-2">
              <p className="text-sm font-semibold text-ink">{user.name}</p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>
            <a
              href="#"
              className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-brand-light"
            >
              My Account
            </a>

            <label className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-ink hover:bg-brand-light">
              Night Mode
              <button
                type="button"
                role="switch"
                aria-checked={night}
                onClick={() => setNight((n) => !n)}
                className={`relative h-5 w-9 rounded-full transition-colors ${
                  night ? 'bg-brand' : 'bg-line'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                    night ? 'translate-x-4' : 'translate-x-0.5'
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
