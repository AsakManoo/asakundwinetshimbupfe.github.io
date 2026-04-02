import { Environment } from '@react-three/drei'

export function Lights() {
  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight
        castShadow
        intensity={1.1}
        position={[6, 8, 4]}
        shadow-mapSize={[1024, 1024]}
      />
      <Environment preset="city" />
    </>
  )
}
