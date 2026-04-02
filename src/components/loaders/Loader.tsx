import { useAppStore } from '../../store/useAppStore'

type LoaderProps = {
  /** Override progress (0–100). If omitted, uses store from CanvasLoader. */
  progress?: number
  className?: string
}

export function Loader({ progress: progressProp, className }: LoaderProps) {
  const load = useAppStore((s) => s.load)
  const progress = progressProp ?? load.progress

  return (
    <div
      className={`flex flex-col items-center gap-2 ${className ?? ''}`}
      role="status"
      aria-live="polite"
    >
      <span className="text-xs font-medium uppercase tracking-wide text-black/70">
        Loading
      </span>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-black/15">
        <div
          className="h-full bg-black transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
