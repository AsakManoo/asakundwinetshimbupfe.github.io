import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { IoBug } from 'react-icons/io5'

/** Base response (1/s); higher = snappier at small separations. */
const SMOOTH_RATE = 18
/** Extra response per px of separation — keeps motion fast when the cursor moves quickly. */
const SMOOTH_RATE_PER_PX = 0.085
/** Max lerp factor per frame (avoids overshoot / jitter). */
const MAX_STEP = 0.96
/** Minimum spacing between trail samples (px). */
const SAMPLE_DIST = 6
/** Max stored samples; oldest dropped when exceeded. */
const MAX_SAMPLES = 400
/** Remove a waypoint when bug is within this distance (px). */
const EAT_DIST = 8
/** Snap when essentially at target (avoids micro-drift). */
const SNAP_DIST = 0.35

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.hypot(dx, dy)
}

function getCursorFollowerEnabledSnapshot() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const fine = window.matchMedia('(pointer: fine)')
  return !reduce.matches && fine.matches
}

function subscribeCursorFollowerEnabled(onStoreChange: () => void) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
  const fine = window.matchMedia('(pointer: fine)')
  const onChange = () => onStoreChange()
  reduce.addEventListener('change', onChange)
  fine.addEventListener('change', onChange)
  return () => {
    reduce.removeEventListener('change', onChange)
    fine.removeEventListener('change', onChange)
  }
}

function buildPolylinePoints(
  samples: { x: number; y: number }[],
  cursor: { x: number; y: number }
): string {
  if (samples.length === 0) {
    return ''
  }
  const parts: string[] = []
  let prev = samples[0]
  parts.push(`${prev.x},${prev.y}`)
  for (let i = 1; i < samples.length; i++) {
    const p = samples[i]
    if (dist(prev, p) > 0.5) {
      parts.push(`${p.x},${p.y}`)
      prev = p
    }
  }
  if (dist(prev, cursor) > 0.5) {
    parts.push(`${cursor.x},${cursor.y}`)
  }
  if (parts.length < 2) {
    return ''
  }
  return parts.join(' ')
}

/** Filled bug icon — dotted trail along pointer path; bug follows the trail. */
export function CursorFollower() {
  const dotRef = useRef<HTMLDivElement>(null)
  const polylineRef = useRef<SVGPolylineElement>(null)
  const samples = useRef<{ x: number; y: number }[]>([])
  const cursor = useRef({ x: 0, y: 0 })
  const bug = useRef({ x: 0, y: 0 })
  const rafId = useRef(0)
  const lastFrameTime = useRef<number | null>(null)
  const moved = useRef(false)
  const [flashKey, setFlashKey] = useState(0)
  const enabled = useSyncExternalStore(
    subscribeCursorFollowerEnabled,
    getCursorFollowerEnabledSnapshot,
    () => true
  )

  useEffect(() => {
    if (!enabled) return

    lastFrameTime.current = null

    const onMove = (e: MouseEvent) => {
      cursor.current = { x: e.clientX, y: e.clientY }
      const last = samples.current[samples.current.length - 1]
      if (!last || dist(last, cursor.current) >= SAMPLE_DIST) {
        samples.current.push({ x: e.clientX, y: e.clientY })
        while (samples.current.length > MAX_SAMPLES) {
          samples.current.pop()
        }
      }
      if (!moved.current) {
        moved.current = true
        bug.current = { x: e.clientX, y: e.clientY }
        const el = dotRef.current
        if (el) {
          el.style.opacity = '1'
          el.style.left = `${e.clientX}px`
          el.style.top = `${e.clientY}px`
        }
      }
    }

    const loop = (now: number) => {
      const dt =
        lastFrameTime.current == null
          ? 1 / 60
          : Math.min(0.1, (now - lastFrameTime.current) / 1000)
      lastFrameTime.current = now

      const cur = cursor.current
      const pts = samples.current
      const target = pts.length > 0 ? pts[0] : cur

      const d = dist(bug.current, target)
      if (d < SNAP_DIST) {
        bug.current.x = target.x
        bug.current.y = target.y
      } else {
        const rate = SMOOTH_RATE + d * SMOOTH_RATE_PER_PX
        const t = Math.min(MAX_STEP, 1 - Math.exp(-rate * dt))
        bug.current.x = lerp(bug.current.x, target.x, t)
        bug.current.y = lerp(bug.current.y, target.y, t)
      }

      while (pts.length > 0 && dist(bug.current, pts[0]) < EAT_DIST) {
        pts.shift()
      }

      const el = dotRef.current
      if (el && moved.current) {
        el.style.left = `${bug.current.x}px`
        el.style.top = `${bug.current.y}px`
      }

      const pl = polylineRef.current
      if (pl && moved.current) {
        const ptsStr = buildPolylinePoints(pts, cur)
        pl.setAttribute('points', ptsStr)
      }

      rafId.current = requestAnimationFrame(loop)
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button === 2) {
        setFlashKey((k) => k + 1)
      }
    }

    document.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    rafId.current = requestAnimationFrame(loop)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('pointerdown', onPointerDown)
      cancelAnimationFrame(rafId.current)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <>
      <svg
        className="pointer-events-none fixed inset-0 z-39 h-screen w-screen text-[#f43800]"
        aria-hidden
      >
        <polyline
          ref={polylineRef}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="5 14"
          vectorEffect="non-scaling-stroke"
          opacity={0.85}
        />
      </svg>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-40 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0 will-change-[left,top]"
        aria-hidden
      >
        <span
          key={flashKey}
          className={`inline-block origin-center will-change-[filter,opacity] ${
            flashKey > 0 ? 'cursor-bug-flash-play' : ''
          }`}
        >
          <span className="inline-flex cursor-bug-outer-glow">
            <IoBug size={24} color="#f43800" aria-hidden />
          </span>
        </span>
      </div>
    </>
  )
}
