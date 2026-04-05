import { useEffect, useState } from 'react'

import { useActiveSectionId } from '../../hooks/useActiveSection'
import { useHeroNamePastNavbar } from '../../hooks/useHeroNamePastNavbar'

function getTimeGreeting(): string {
  const h = new Date().getHours()
  if (h >= 5 && h < 12) return 'Good Morning!'
  if (h >= 12 && h < 17) return 'Good Afternoon!'
  return 'Good Evening!'
}

function useTimeGreeting() {
  const [greeting, setGreeting] = useState(getTimeGreeting)
  useEffect(() => {
    const id = window.setInterval(() => setGreeting(getTimeGreeting()), 60_000)
    return () => clearInterval(id)
  }, [])
  return greeting
}

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17 17 7M17 7H9M17 7v8" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: 'About Me', href: '#about' },
  { label: 'Resume', href: '#resume' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
] as const

const linkBase =
  "relative inline-block pb-2 text-xs font-medium text-white/90 transition-opacity hover:opacity-100 md:text-sm after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-full after:-translate-x-1/2 after:origin-center after:bg-white after:transition-transform after:duration-500 after:ease-out after:content-['']"

export function Navbar() {
  const activeId = useActiveSectionId()
  const greeting = useTimeGreeting()
  const heroNamePastNavbar = useHeroNamePastNavbar()
  const showHeroGreeting = !heroNamePastNavbar

  return (
    <header className="sticky top-0 z-30 w-full border-b border-white/15 bg-black/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12)] backdrop-blur-xl backdrop-saturate-150">
      <nav
        className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-6 py-6 md:px-10 lg:px-14 [text-shadow:0_1px_3px_rgba(0,0,0,0.65)]"
        aria-label="Main"
      >
        <div className="flex min-w-0 items-center justify-start gap-8 md:gap-12 lg:gap-14">
          <a
            href="#hero"
            aria-label={showHeroGreeting ? `Home — ${greeting}` : 'Home'}
            className={`group relative inline-flex min-h-[2rem] shrink-0 items-center leading-none tracking-tight transition-opacity hover:opacity-70 focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              showHeroGreeting
                ? 'max-w-[min(100%,14rem)] font-normal text-sm text-neutral-400 sm:max-w-none'
                : 'text-3xl font-bold text-white md:text-4xl'
            }`}
          >
            {showHeroGreeting ? (
              <span className="inline-block transition-opacity duration-300 ease-out">
                {greeting}
              </span>
            ) : (
              <span
                key="nav-asa-logo"
                className="nav-logo-animated inline-flex items-baseline"
              >
                ASA
                <span
                  aria-hidden
                  className="asa-dot-bounce ml-[0.1em] inline-block h-[0.32em] w-[0.32em] rounded-full bg-white align-baseline transition-colors duration-300 group-hover:bg-[#f53700]"
                />
              </span>
            )}
          </a>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 md:gap-x-8">
            {NAV_LINKS.map(({ label, href }) => {
              const sectionId = href.slice(1)
              const isActive = activeId === sectionId
              return (
                <li key={href}>
                  <a
                    href={href}
                    className={`${linkBase} ${
                      isActive
                        ? 'after:scale-x-100'
                        : 'after:scale-x-0 hover:after:scale-x-100'
                    }`}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
        <a
          href="mailto:asakundwi.netshimbupfe@gmail.com"
          className="group ml-auto flex max-w-[min(100%,22rem)] flex-wrap items-center justify-end gap-2 text-right text-xs font-medium text-white/90 no-underline transition-colors duration-500 ease-out hover:text-[#f53700] hover:ease-in sm:max-w-none md:text-sm"
        >
          <span className="relative inline-block pb-2 after:pointer-events-none after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-full after:-translate-x-1/2 after:origin-center after:scale-x-100 after:bg-white after:transition-colors after:duration-500 after:ease-out after:content-[''] group-hover:after:bg-[#f53700] group-hover:after:ease-in">
            asakundwi.netshimbupfe@gmail.com
          </span>
          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 stroke-[2.25] md:h-4 md:w-4" />
        </a>
      </nav>
    </header>
  )
}
