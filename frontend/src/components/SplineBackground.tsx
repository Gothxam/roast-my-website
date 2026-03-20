"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

// Load Spline lazily — won't block initial paint
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => null,
});

export default function SplineBackground() {
  const [loaded, setLoaded] = useState(false);

  const onLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div
      className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none"
      // Promote to own GPU layer so scroll doesn't repaint it
      style={{ willChange: "transform", transform: "translateZ(0)" }}
    >
      {/* CSS glow fades out once Spline is loaded */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: loaded ? 0 : 1 }}
      >
        <div className="absolute inset-0 bg-[#050508]" />
        <div
          className="absolute rounded-full opacity-40 animate-glow-1"
          style={{
            width: "80vw", height: "80vw",
            top: "-20vw", left: "10vw",
            background: "radial-gradient(circle, rgba(88,28,235,0.25) 0%, transparent 70%)",
            willChange: "transform",
          }}
        />
        <div
          className="absolute rounded-full opacity-30 animate-glow-2"
          style={{
            width: "60vw", height: "60vw",
            bottom: "-10vw", right: "0vw",
            background: "radial-gradient(circle, rgba(234,88,12,0.2) 0%, transparent 70%)",
            willChange: "transform",
          }}
        />
      </div>

      {/* Spline scene — fades in once ready */}
      <div
        className="absolute inset-0 transition-opacity duration-1000"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: "max(100vw, 177.77vh)", height: "max(100vh, 56.25vw)" }}
        >
          <Spline
            onLoad={onLoad}
            scene="https://prod.spline.design/5U0KUgj3xBsmfox8/scene.splinecode"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

    </div>
  );
}