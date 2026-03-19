"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CinematicBackground() {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate particles only on the client to avoid hydration mismatch
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 20 + 10,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Moving Ambient Orbs */}
      <motion.div
        animate={{
          x: [0, 100, -100, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -150, 150, 0],
          y: [0, 100, -100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"
      />
      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, 200, -200, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[100px]"
      />

      {/* Floating Particles/Stars */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0 }}
          animate={{
            y: ["0vh", "100vh"],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 10,
          }}
          style={{
            left: `${p.x}%`,
            top: `-5%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          className="absolute bg-white rounded-full shadow-[0_0_10px_white]"
        />
      ))}

      {/* Grid Overlay with slight animation */}
      <motion.div 
        animate={{
            opacity: [0.03, 0.05, 0.03]
        }}
        transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" 
      />
    </div>
  );
}
