import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Scene } from './components/canvas/Scene'
import { About } from './components/interface/About'
import { Contact } from './components/interface/Contact'
import { Resume } from './components/interface/Resume'
import { Hero } from './components/interface/Hero'
import { Navbar } from './components/interface/Navbar'
import { CanvasLoader } from './components/loaders/CanvasLoader'
import { PageLoader } from './components/loaders/PageLoader'
import { useScroll } from './hooks/useScroll'
import { Service } from './components/interface/Service'
import { Portfolio } from './components/interface/Portfolio'
import { CursorFollower } from './components/interface/CursorFollower'

function App() {
  useScroll()

  return (
    <div className="relative min-h-screen bg-black text-white">
      <CursorFollower />
      <PageLoader />
      <div className="fixed inset-0 -z-10 h-screen w-full">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          className="h-full w-full"
        >
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <CanvasLoader />
            <Scene />
          </Suspense>
        </Canvas>
      </div>
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <Resume />
        <Portfolio />
        <Service />
        <Contact />
      </main>
    </div>
  )
}

export default App
