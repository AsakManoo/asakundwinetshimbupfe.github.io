import { PerspectiveCamera } from '@react-three/drei'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import type { PerspectiveCamera as PerspectiveCameraImpl } from 'three'

export function CameraRig() {
  const camRef = useRef<PerspectiveCameraImpl>(null)

  useLayoutEffect(() => {
    const cam = camRef.current
    if (!cam) return
    cam.position.z = 12
    gsap.to(cam.position, { z: 5, duration: 1.4, ease: 'power2.out' })
  }, [])

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      fov={45}
      position={[0, 0, 5]}
    />
  )
}
