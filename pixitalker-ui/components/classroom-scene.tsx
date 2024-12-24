'use client'

import { Text } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"

export function ClassroomScene() {
  const teacherRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (teacherRef.current) {
      teacherRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <group>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 5, -5]} castShadow receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#fef9c3" />
      </mesh>

      {/* Teacher Placeholder */}
      <group ref={teacherRef} position={[0, 1, -2]}>
        <mesh castShadow>
          <boxGeometry args={[1, 2, 0.5]} />
          <meshStandardMaterial color="#60a5fa" />
        </mesh>
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.5}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
        >
          Teacher
        </Text>
      </group>

      {/* Decorative Elements */}
      <group position={[-4, 3, -4.8]}>
        <mesh castShadow>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial color="#fcd34d" />
        </mesh>
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.2}
          color="#1e293b"
          anchorX="center"
          anchorY="middle"
        >
          Welcome to Class!
        </Text>
      </group>
    </group>
  )
}

