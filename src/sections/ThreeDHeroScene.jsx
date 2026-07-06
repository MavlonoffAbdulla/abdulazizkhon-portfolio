import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MathUtils } from "three";

function SceneContent({ enableParallax, mouseRef }) {
  const groupRef = useRef();
  const solidRef = useRef();
  const wireRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (enableParallax) {
      // Lerp base group rotation towards mouse coordinate offsets
      const targetX = mouseRef.current.x * 0.5;
      const targetY = -mouseRef.current.y * 0.5;

      groupRef.current.rotation.y = MathUtils.lerp(groupRef.current.rotation.y, targetX, 0.05);
      groupRef.current.rotation.x = MathUtils.lerp(groupRef.current.rotation.x, targetY, 0.05);
    } else {
      // Auto-rotation when parallax is disabled
      groupRef.current.rotation.y += delta * 0.15;
      groupRef.current.rotation.x += delta * 0.08;
    }

    // Additional relative rotation for visual depth
    if (solidRef.current) {
      solidRef.current.rotation.y += delta * 0.1;
      solidRef.current.rotation.z += delta * 0.05;
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= delta * 0.06;
      wireRef.current.rotation.x += delta * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Solid inner low-poly octahedron */}
      <mesh ref={solidRef}>
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial
          color="#1F4E9C"
          roughness={0.4}
          metalness={0.2}
          flatShading
        />
      </mesh>

      {/* Wireframe outer low-poly octahedron */}
      <mesh ref={wireRef} rotation={[0.5, 0.5, 0.5]}>
        <octahedronGeometry args={[2.3, 0]} />
        <meshBasicMaterial
          color="#1F4E9C"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

export default function ThreeDHeroScene({ enableParallax }) {
  const [isIntersecting, setIsIntersecting] = useState(true);
  const containerRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  // Track intersection state to pause rendering when scrolled out of view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.01 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Track window mouse movements for cursor parallax (Desktop only)
  useEffect(() => {
    if (!enableParallax) return;

    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      mouseRef.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enableParallax]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center"
    >
      {isIntersecting && (
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 6], fov: 50 }}
          className="w-full h-full pointer-events-none"
          style={{ pointerEvents: "none" }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.5} color="#EAF1FB" />
          <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#1F4E9C" />
          <SceneContent enableParallax={enableParallax} mouseRef={mouseRef} />
        </Canvas>
      )}
    </div>
  );
}
