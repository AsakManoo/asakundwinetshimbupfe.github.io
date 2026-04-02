import { useLayoutEffect, useState } from 'react'

/** Matches `[id]` scroll targets in `App` (order = document order). */
const SECTION_ORDER = [
  'hero',
  'about',
  'resume',
  'portfolio',
  'services',
  'contact',
] as const

/** Aligns with `scroll-margin-top` on `[id]` in globals (~7.5rem). */
const SCROLL_MARK_OFFSET_PX = 120

function getDocumentTop(el: HTMLElement): number {
  const rect = el.getBoundingClientRect()
  return rect.top + window.scrollY
}

function getActiveSectionIdFromScroll(): string {
  const marker = window.scrollY + SCROLL_MARK_OFFSET_PX
  let active: (typeof SECTION_ORDER)[number] = 'hero'
  for (const id of SECTION_ORDER) {
    const el = document.getElementById(id)
    if (!el) continue
    if (getDocumentTop(el) <= marker) active = id
  }
  return active
}

export function useActiveSectionId(): string {
  const [activeId, setActiveId] = useState<string>('hero')

  useLayoutEffect(() => {
    const update = () => setActiveId(getActiveSectionIdFromScroll())

    update()
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        update()
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('hashchange', update)
    window.addEventListener('resize', update)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('hashchange', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return activeId
}
