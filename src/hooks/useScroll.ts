import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

export function useScroll() {
  const setScrollProgress = useAppStore((s) => s.setScrollProgress)

  useEffect(() => {
    const onScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0
      setScrollProgress(Math.min(1, Math.max(0, ratio)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [setScrollProgress])
}
