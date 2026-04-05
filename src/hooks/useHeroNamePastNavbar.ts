import { useEffect, useState } from 'react'

const HERO_NAME_ID = 'hero-name'

/** True when #hero-name has scrolled above the sticky header (no longer intersects the band below the navbar). */
export function useHeroNamePastNavbar(): boolean {
  const [past, setPast] = useState(false)

  useEffect(() => {
    let observer: IntersectionObserver | null = null
    let cancelled = false

    const headerOffset = () => {
      const header = document.querySelector('header')
      return header ? Math.ceil(header.getBoundingClientRect().height) : 80
    }

    const connect = (target: HTMLElement) => {
      observer?.disconnect()
      const top = headerOffset()
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!cancelled) setPast(!entry.isIntersecting)
        },
        { root: null, rootMargin: `-${top}px 0px 0px 0px`, threshold: 0 }
      )
      observer.observe(target)
    }

    let attempts = 0
    const tryConnect = () => {
      const target = document.getElementById(HERO_NAME_ID)
      if (target) {
        connect(target)
        return
      }
      if (cancelled || attempts++ > 60) return
      requestAnimationFrame(tryConnect)
    }

    tryConnect()

    const onResize = () => {
      const target = document.getElementById(HERO_NAME_ID)
      if (target) connect(target)
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      cancelled = true
      observer?.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return past
}
