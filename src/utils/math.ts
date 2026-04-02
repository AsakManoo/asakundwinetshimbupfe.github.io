export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}
