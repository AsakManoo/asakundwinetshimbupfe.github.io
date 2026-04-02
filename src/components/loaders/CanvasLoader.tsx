import { useProgress } from '@react-three/drei'
import { useEffect } from 'react'
import { useAppStore } from '../../store/useAppStore'

/** Inside Canvas: syncs `useProgress` to the store for `PageLoader` and other UI. */
export function CanvasLoader() {
  const { active, progress } = useProgress()
  const setLoadState = useAppStore((s) => s.setLoadState)

  useEffect(() => {
    setLoadState({ active, progress })
  }, [active, progress, setLoadState])

  return null
}
