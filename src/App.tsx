import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Scene } from './components/canvas/Scene'
import { About } from './components/interface/About'
import { Contact } from './components/interface/Contact'
import { Hero } from './components/interface/Hero'
import { CanvasLoader } from './components/loaders/CanvasLoader'
import { PageLoader } from './components/loaders/PageLoader'
import { useScroll } from './hooks/useScroll'

function App() {
  useScroll()

  return (
    <div className="relative min-h-screen bg-neutral-950">
      <PageLoader />
      <div className="fixed inset-0 -z-10 h-screen w-full">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          className="h-full w-full"
        >
          <color attach="background" args={['#0a0a0a']} />
          <Suspense fallback={null}>
            <CanvasLoader />
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <main className="relative z-10">
        <Hero />
        <About />
        <Contact />
      </main>
    </div>
  )
}

export default App
