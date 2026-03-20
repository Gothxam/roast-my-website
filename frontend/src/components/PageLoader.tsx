"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame } from "lucide-react";

export default function PageLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Hide once the window "load" event fires (all resources loaded)
    const hide = () => setTimeout(() => setVisible(false), 400); // slight extra delay feels intentional

    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide, { once: true });
      // Safety net — never block the page for more than 5s
      const safetyTimer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(safetyTimer);
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute rounded-full opacity-30"
              style={{
                width: "60vw", height: "60vw",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(circle, rgba(88,28,235,0.35) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <Flame className="w-14 h-14 text-orange-500" />
              <div className="absolute inset-0 bg-orange-500/30 blur-2xl rounded-full" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">Roast My Website</h1>
              <p className="text-gray-500 text-xs mt-1 font-mono">Loading the honesty engine...</p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5 mt-4">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-orange-500"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
