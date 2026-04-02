import { MeshDistortMaterial } from '@react-three/drei'

export function PlaceholderModel() {
  return (
    <mesh castShadow receiveShadow position={[0, 0, 0]}>
      <sphereGeometry args={[1.1, 48, 48]} />
      <MeshDistortMaterial
        color="#6366f1"
        distort={0.25}
        speed={1.6}
        roughness={0.35}
        metalness={0.2}
      />
    </mesh>
  )
}
