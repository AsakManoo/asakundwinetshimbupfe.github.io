import { useEffect, useRef, useState } from 'react'

import heroImage from '../../assets/hero02.png'

const NAME_CYCLE_MS = 3200

/** Scroll progress 0–1 over the hero scroll track (wrapper height − viewport). */
function getScrollProgress(scrollTrack: HTMLElement): number {
  const top = scrollTrack.getBoundingClientRect().top + window.scrollY
  const range = scrollTrack.offsetHeight - window.innerHeight
  if (range <= 0) return 0
  return Math.min(1, Math.max(0, (window.scrollY - top) / range))
}

/** Zoom ramps to max by this fraction of progress, then hold while dimming runs. */
const ZOOM_END_PROGRESS = 0.58
const ZOOM_MIN = 1
const ZOOM_MAX = 1.42

/** Dim + image fade start after zoom has mostly completed. */
const DIM_START_PROGRESS = 0.5

function zoomForProgress(p: number, reducedMotion: boolean): number {
  if (reducedMotion) return ZOOM_MIN
  const t = Math.min(1, p / ZOOM_END_PROGRESS)
  return ZOOM_MIN + (ZOOM_MAX - ZOOM_MIN) * t
}

function dimForProgress(p: number, reducedMotion: boolean): number {
  if (reducedMotion) return p > 0.85 ? (p - 0.85) / 0.15 : 0
  if (p <= DIM_START_PROGRESS) return 0
  return Math.min(1, (p - DIM_START_PROGRESS) / (1 - DIM_START_PROGRESS))
}

function HeroNameToggle() {
  const [kundwiMuted, setKundwiMuted] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) return
    const id = window.setInterval(() => {
      setKundwiMuted((v) => !v)
    }, NAME_CYCLE_MS)
    return () => window.clearInterval(id)
  }, [])

  return (
    <>
      <span className="sr-only">Asakundwi Netshimbupfe</span>
      <span aria-hidden className="inline-flex flex-wrap items-baseline">
        <span className="inline-flex items-baseline">
          Asa
          {kundwiMuted && (
            <span className="ml-[0.08em] inline-block h-[0.32em] w-[0.32em] shrink-0 rounded-full bg-white align-baseline" />
          )}
        </span>
        <span
          className={`transition-colors duration-500 ease-in-out ${
            kundwiMuted ? 'text-[#7e7e7e]' : 'text-white'
          }`}
        >
          kundwi
        </span>
        <span className="text-[#7e7e7e]">&nbsp;Netshimbupfe</span>
      </span>
    </>
  )
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

const SERVICES = [
  'Front-End Development',
  'React & Next.js',
  'Responsive UI',
  'Performance & Accessibility',
] as const

const BADGES = ['Modern stack', 'Accessible', 'User-focused'] as const

export function Hero() {
  const scrollTrackRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const dimRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = scrollTrackRef.current
    const bg = bgRef.current
    const dim = dimRef.current
    const content = contentRef.current
    if (!track || !bg || !dim) return

    let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = () => {
      reducedMotion = mq.matches
    }
    mq.addEventListener('change', onMq)

    const apply = () => {
      const p = getScrollProgress(track)
      const scale = zoomForProgress(p, reducedMotion)
      const dimAmount = dimForProgress(p, reducedMotion)
      const imageFade = 1 - dimAmount * 0.55

      bg.style.transform = `scale(${scale})`
      bg.style.opacity = String(imageFade)
      dim.style.opacity = String(dimAmount * 0.92)
      if (content) {
        const contentFade = 1 - dimAmount * 0.35
        content.style.opacity = String(contentFade)
      }
    }

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(apply)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    apply()

    return () => {
      mq.removeEventListener('change', onMq)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div ref={scrollTrackRef} className="relative h-[200vh]">
      <section
        id="hero"
        className="sticky top-0 flex min-h-dvh flex-col overflow-hidden bg-black text-white"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            ref={bgRef}
            className="absolute inset-0 bg-center bg-no-repeat will-change-transform"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundPosition: 'center center',
              backgroundSize: 'min(68%, 720px) auto',
              transformOrigin: 'center center',
            }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background: `
              radial-gradient(ellipse 42% 48% at 90% 50%, rgba(245, 57, 0, 0.52) 0%, transparent 58%),
              radial-gradient(ellipse 100% 90% at 100% 50%, rgba(245, 57, 0, 0.2) 0%, transparent 60%)
            `,
          }}
          aria-hidden
        />
        <div
          ref={dimRef}
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ opacity: 0 }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-l from-orange-950/25 via-transparent to-transparent"
          aria-hidden
        />

        <div ref={contentRef} className="relative z-10 flex min-h-0 flex-1 flex-col">
          <div className="mx-auto w-full max-w-[1600px] flex-1 px-6 pb-16 pt-20 md:px-10 md:pb-20 lg:px-14 lg:pb-24">
            <div className="relative lg:min-h-[min(78vh,780px)]">
              <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-10 lg:gap-y-0">
                <div className="z-10 flex flex-col gap-12 lg:min-h-[min(62vh,640px)] lg:gap-0">
                  <div>
                    <p className="text-sm text-neutral-400">Hi there! this is</p>
                    <p className="mt-4 text-2xl font-semibold tracking-tight md:text-3xl">
                      <HeroNameToggle />
                    </p>
                  </div>
                </div>

                <div className="z-10 flex flex-col justify-between gap-12 lg:min-h-[min(62vh,640px)] lg:gap-0 lg:text-right">
                  <nav aria-label="Focus areas">
                    <ul className="space-y-3 border-b border-white/10 pb-8 text-sm text-neutral-400">
                      {SERVICES.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </nav>

                  <div className="flex flex-col gap-12 lg:items-end">
                    <a
                      href="#contact"
                      className="group inline-flex items-center gap-2 text-sm font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-[#f53700] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      How can I help?
                      <ArrowUpRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>

                    <p className="max-w-sm text-pretty text-sm leading-relaxed text-white/90 lg:ml-auto">
                      I&apos;m a front-end developer focused on intuitive, accessible,
                      high-conversion interfaces. I work with JavaScript (ES6+), React,
                      and Next.js—building digital products that solve real user
                      problems.
                    </p>

                    <div
                      className="flex flex-wrap items-center gap-x-8 gap-y-3 lg:justify-end"
                      aria-label="Principles"
                    >
                      {BADGES.map((label) => (
                        <span
                          key={label}
                          className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <h1 className="pointer-events-none relative z-20 mt-8 mb-28 text-left md:mb-32 lg:absolute lg:bottom-auto lg:left-0 lg:right-0 lg:top-[min(40vh,15.5rem)] lg:mb-0 lg:mt-0 lg:text-left">
                <span className="block text-[clamp(2.25rem,9vw,6.5rem)] font-bold uppercase leading-[0.92] tracking-tight text-white">
                  Front-end
                </span>
                <span className="block text-[clamp(2.25rem,9vw,6.5rem)] font-bold uppercase leading-[0.92] tracking-tight text-white">
                  Development
                </span>
                <span className="block text-[clamp(2.25rem,9vw,6.5rem)] font-bold uppercase leading-[0.92] tracking-tight text-[#f53700]">
                  Web Developer
                </span>
              </h1>
            </div>
          </div>

          <p className="pointer-events-none absolute bottom-20 left-6 z-20 text-sm text-neutral-500 md:bottom-24 md:left-10 lg:bottom-28 lg:left-14">
            (Scroll down)
          </p>
        </div>
      </section>
    </div>
  )
}
