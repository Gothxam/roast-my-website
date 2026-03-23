"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

/**
 * Global Mouse Tracker
 */
const mouseState = { x: 0, y: 0 };

function useGlobalMouse() {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseState.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseState.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
}

/**
 * Floating 3D Geometric Objects (The "Material")
 */
function FloatingObjects() {
  const meshRefs = useRef<THREE.Mesh[]>([]);
  const count = 6;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      mesh.rotation.x = time * (0.1 + i * 0.05);
      mesh.rotation.y = time * (0.15 + i * 0.02);
      mesh.position.y += Math.sin(time + i) * 0.002;
    });
  });

  const positions: [number, number, number][] = [
    [4, 2, -2],
    [-4, -2, -3],
    [5, -4, -1],
    [-6, 3, -4],
    [0, -5, -2],
    [2, 5, -3]
  ];

  return (
    <>
      {positions.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => (meshRefs.current[i] = el!)}
          position={pos}
        >
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshPhysicalMaterial
            transparent
            opacity={0.15}
            transmission={0.9}
            thickness={1}
            roughness={0.1}
            metalness={0.2}
            color="#581ceb"
          />
        </mesh>
      ))}
    </>
  );
}

/**
 * Interactive Light following the mouse
 */
function MouseLight() {
  const lightRef = useRef<THREE.PointLight>(null!);
  
  useFrame(() => {
    lightRef.current.position.x = mouseState.x * 6;
    lightRef.current.position.y = mouseState.y * 4;
    lightRef.current.position.z = 2;
  });

  return (
    <>
      <pointLight 
        ref={lightRef} 
        intensity={30} 
        distance={20} 
        color="#ea580c" 
      />
      <pointLight 
        position={[-5, 5, 3]} 
        intensity={15} 
        color="#581ceb" 
      />
    </>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(1500 * 3);
    const col = new Float32Array(1500 * 3);
    const color = new THREE.Color();
    for (let i = 0; i < 1500; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      color.setHSL(0.7 + Math.random() * 0.1, 0.8, 0.2); 
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.x = time * 0.01;
    ref.current.rotation.y = time * 0.005;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.01}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

const ThreeBackground = () => {
  useGlobalMouse();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#020205]">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <color attach="background" args={["#020205"]} />
        <ambientLight intensity={0.2} />
        <FloatingObjects />
        <MouseLight />
        <ParticleField />
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
    </div>
  );
};

export default ThreeBackground;
