import { useState } from 'react'
import Button from '../Button/Button'
import Navigation from '../Navigation/Navigation'

/**
 * Header - top bar with logo, navigation and Sign In / Join Us buttons
 * (for unauthorized users). Below 600px the navigation collapses into a
 * three-dots menu that opens the mobile drawer.
 */
function Header({ navItems, onSignIn, onJoinUs }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <a href="#" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-heading text-lg font-bold text-white">
            L
          </span>
          <span className="font-heading text-lg font-semibold">learn-app</span>
        </a>

        <div className="flex items-center gap-6">
          <Navigation
            items={navItems}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
          />

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" onClick={onSignIn}>
              Sign In
            </Button>
            <Button size="sm" onClick={onJoinUs}>
              Join Us
            </Button>
          </div>

          {/* Three-dots trigger (< 600px) */}
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setMenuOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg hover:bg-black/5 md:hidden"
          >
            <span className="text-2xl leading-none">⋯</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
