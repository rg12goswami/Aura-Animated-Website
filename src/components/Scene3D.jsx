import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import AdaptiveCanvas from "./AdaptiveCanvas";
import { Float, RoundedBox, Torus } from "@react-three/drei";

function CareMark() {
  const group = useRef(null);
  const ring = useRef(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x = state.pointer.y * 0.08;
    group.current.rotation.z = -state.pointer.x * 0.07;
    if (ring.current) ring.current.rotation.z += delta * 0.08;
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.28}>
        <group rotation={[0.12, -0.18, -0.18]}>
          {/* A tactile, toy-like healthcare cross instead of a generic glowing orb. */}
          <RoundedBox args={[0.48, 1.52, 0.36]} radius={0.2} smoothness={5} position={[0, 0, 0]} castShadow>
            <meshStandardMaterial color="#D94F38" roughness={0.32} metalness={0.02} />
          </RoundedBox>
          <RoundedBox args={[1.52, 0.48, 0.36]} radius={0.2} smoothness={5} position={[0, 0, 0.02]} castShadow>
            <meshStandardMaterial color="#D94F38" roughness={0.32} metalness={0.02} />
          </RoundedBox>
          <RoundedBox args={[0.23, 0.93, 0.13]} radius={0.1} smoothness={5} position={[0, 0, 0.205]}>
            <meshStandardMaterial color="#F7F5F0" roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.93, 0.23, 0.13]} radius={0.1} smoothness={5} position={[0, 0, 0.21]}>
            <meshStandardMaterial color="#F7F5F0" roughness={0.4} />
          </RoundedBox>
        </group>
      </Float>

      <Torus ref={ring} args={[1.48, 0.014, 12, 120]} rotation={[0.95, 0.28, -0.2]}>
        <meshStandardMaterial color="#242321" roughness={0.45} />
      </Torus>

      <Float speed={1.8} floatIntensity={0.4}>
        <mesh position={[1.34, 0.82, 0.2]} rotation={[0.3, 0.2, 0.4]} castShadow>
          <sphereGeometry args={[0.19, 32, 32]} />
          <meshStandardMaterial color="#B9DCCB" roughness={0.28} />
        </mesh>
      </Float>

      <Float speed={1.5} floatIntensity={0.35}>
        <mesh position={[-1.2, -0.88, 0.25]} rotation={[0.2, 0.5, 0.2]}>
          <sphereGeometry args={[0.105, 24, 24]} />
          <meshStandardMaterial color="#F18A68" roughness={0.3} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="scene3d">
     <AdaptiveCanvas
        shadows
        camera={{ position: [0, 0, 5.3], fov: 36 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.65} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} castShadow />
        <pointLight position={[-3, -2, 3]} intensity={0.7} color="#F18A68" />
        <CareMark />
  </AdaptiveCanvas>
    </div>
  );
}
