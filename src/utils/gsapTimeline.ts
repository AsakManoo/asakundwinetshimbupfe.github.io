import gsap from 'gsap'

/**
 * Shared GSAP defaults for camera and scene motion. Extend with your own timelines.
 */
export const gsapDefaults = {
  ease: 'power2.inOut' as const,
  duration: 1,
}

export function createCameraIntroTimeline() {
  return gsap.timeline({ defaults: gsapDefaults })
}
