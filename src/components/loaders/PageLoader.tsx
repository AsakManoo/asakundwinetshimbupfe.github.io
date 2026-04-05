import { Loader } from './Loader'
import { useAppStore } from '../../store/useAppStore'

/**
 * Full-screen overlay while the canvas reports loading via {@link CanvasLoader}.
 */
export function PageLoader() {
  const { active, progress } = useAppStore((s) => s.load)
  if (!active) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      aria-busy="true"
    >
      <Loader progress={progress} />
    </div>
  )
}
