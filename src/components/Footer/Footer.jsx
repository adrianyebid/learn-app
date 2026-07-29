import { useState } from 'react'
import Button from '../Button/Button'

/**
 * Footer - logo, 3 navigation blocks, subscription form, privacy list,
 * social icons (icon-font style) and a change-language control.
 */
const NAV_BLOCKS = [
  { title: 'Product', links: ['Features', 'Pricing', 'Blog'] },
  { title: 'Company', links: ['About', 'Careers', 'Contact'] },
  { title: 'Resources', links: ['Docs', 'Support', 'Community'] },
]

const SOCIAL = ['𝕏', 'f', 'in', '◎']
const PRIVACY = ['Privacy Policy', 'Terms of Service', 'Cookies']

function Footer({ blocks = NAV_BLOCKS }) {
  const [lang, setLang] = useState('EN')
  const [email, setEmail] = useState('')

  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-5">
          {/* Logo + subscription */}
          <div className="md:col-span-2">
            <a href="#" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand font-heading text-lg font-bold text-white">
                L
              </span>
              <span className="font-heading text-lg font-semibold">
                learn-app
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted">
              Subscribe to get the latest news and updates.
            </p>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-brand"
              />
              <Button type="submit" size="sm">
                Subscribe
              </Button>
            </form>
          </div>

          {/* 3 navigation blocks */}
          {blocks.map((block) => (
            <nav key={block.title}>
              <h4 className="text-sm font-semibold text-ink">{block.title}</h4>
              <ul className="mt-3 space-y-2">
                {block.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted transition-colors hover:text-brand"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-4 border-t border-line pt-6 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-4">
            {PRIVACY.map((item) => (
              <li key={item}>
                <a href="#" className="text-xs text-muted hover:text-brand">
                  {item}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            {/* Social icons */}
            <ul className="flex gap-2">
              {SOCIAL.map((icon, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className="grid h-8 w-8 place-items-center rounded-full bg-brand-light text-sm text-brand hover:bg-brand hover:text-white"
                  >
                    {icon}
                  </a>
                </li>
              ))}
            </ul>

            {/* Change language */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label="Change language"
              className="rounded-lg border border-line bg-surface px-2 py-1 text-xs outline-none focus:border-brand"
            >
              <option value="EN">English</option>
              <option value="ES">Español</option>
              <option value="DE">Deutsch</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
