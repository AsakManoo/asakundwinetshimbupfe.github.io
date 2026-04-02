import { Suspense } from 'react'
import { CameraRig } from './Camera'
import { Lights } from './Lights'
import { PlaceholderModel } from './models/PlaceholderModel'

export function Scene() {
  return (
    <>
      <CameraRig />
      <Suspense fallback={null}>
        <Lights />
        <PlaceholderModel />
      </Suspense>
    </>
  )
}
