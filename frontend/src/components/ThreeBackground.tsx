"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

/**
 * Global Mouse Tracker Hook
 * Bypasses z-index blocking for background interaction.
 */
const mouseState = { x: 0, y: 0 };

function useGlobalMouse() {
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize to -1 to 1 (matching Three.js viewport)
      mouseState.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseState.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
}

/**
 * Interactive 3D Blob (Liquid Glass)
 * Uses vertex displacement and Fresnel shading for a premium look.
 */
const Blob = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_intensity: { value: 0.3 },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    uniforms.u_time.value = clock.getElapsedTime();
    
    // Smoothly interpolate towards global mouse state
    const lerpSpeed = 0.08; // Slightly faster for responsiveness
    uniforms.u_mouse.value.x += (mouseState.x - uniforms.u_mouse.value.x) * lerpSpeed;
    uniforms.u_mouse.value.y += (mouseState.y - uniforms.u_mouse.value.y) * lerpSpeed;
    
    if (meshRef.current) {
      // Rotation follows mouse aggressively
      meshRef.current.rotation.x = uniforms.u_mouse.value.y * 0.8;
      meshRef.current.rotation.y = uniforms.u_mouse.value.x * 0.8;
      meshRef.current.rotation.z = uniforms.u_time.value * 0.1;
      
      // Position shift follows mouse (increased gain)
      meshRef.current.position.x = uniforms.u_mouse.value.x * 0.8;
      meshRef.current.position.y = uniforms.u_mouse.value.y * 0.8;
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_intensity;

    // Compact and robust 3D noise for liquid deformation
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    float noise(vec3 x) {
      vec3 p = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      float n = p.x + p.y * 57.0 + p.z * 113.0;
      return mix(mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
                     mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y),
                 mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                     mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
    }

    void main() {
      vUv = uv;
      vNormal = normal;
      
      // Mouse interaction: Make displacement stronger where the mouse is "pointing"
      float mouseInfluence = 1.0 + length(u_mouse) * 0.5;
      
      // Multi-layered noise for more organic liquid deformation
      float n = noise(position * 1.5 + u_time * 0.5 + vec3(u_mouse * 0.5, 0.0));
      n += noise(position * 3.0 - u_time * 0.2) * 0.5;
      
      vec3 displacedPosition = position + normal * n * u_intensity * mouseInfluence;
      
      vec4 modelViewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
      vViewPosition = -modelViewPosition.xyz;
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float u_time;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      float time = u_time * 0.5;
      
      // Fresnel effect for glowing glass edges
      float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.5);
      
      // Premium Iridescent Palette
      vec3 deepSpace = vec3(0.02, 0.01, 0.05);  // Deep background
      vec3 purple = vec3(0.5, 0.2, 1.0);       // Vibrant purple
      vec3 cyan = vec3(0.2, 0.8, 1.0);         // Electric blue/cyan
      vec3 neonOrange = vec3(1.0, 0.4, 0.1);    // Bright highlight
      
      // Create a moving iridescent pattern
      float pattern = sin(vUv.x * 20.0 + time) * cos(vUv.y * 20.0 - time);
      pattern += sin(normal.x * 10.0 + normal.z * 10.0 + time);
      
      // Mix colors for a liquid glass look
      vec3 color = mix(deepSpace, purple, fresnel * 0.8);
      color = mix(color, cyan, max(0.0, normal.y) * fresnel);
      color = mix(color, neonOrange, pow(max(0.0, normal.z), 3.0) * (pattern * 0.2 + 0.8));
      
      // Add subtle internal glow
      color += purple * 0.1 * (1.0 - fresnel);
      
      // Glint effect
      float glint = pow(max(0.0, dot(reflect(-viewDir, normal), vec3(0.5, 0.5, 1.0))), 20.0);
      color += vec3(1.0) * glint * 0.4;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} scale={1.2}>
      <icosahedronGeometry args={[1, 15]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        wireframe={false}
      />
    </mesh>
  );
};

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(2000 * 3);
    const col = new Float32Array(2000 * 3);
    const color = new THREE.Color();
    for (let i = 0; i < 2000; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5; // Keep them closer to the camera than the background
      color.setHSL(0.7 + Math.random() * 0.1, 0.8, 0.5);
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    ref.current.rotation.x = time * 0.05;
    ref.current.rotation.y = time * 0.03;

    // React to global mouse
    const targetX = mouseState.x * 0.5;
    const targetY = mouseState.y * 0.5;
    ref.current.position.x += (targetX - ref.current.position.x) * 0.05;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.05;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.015}
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
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Blob />
        <ambientLight intensity={0.5} />
        <ParticleField />
      </Canvas>
      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(3,0,20,0.4)_100%)] pointer-events-none" />
    </div>
  );
};

export default ThreeBackground;
