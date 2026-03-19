"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useCallback } from "react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
});

export default function SplineBackground() {
  const splineRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = useCallback((app: any) => {
    splineRef.current = app;
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!splineRef.current || !isLoaded) return;

      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress = scrollTop / maxScroll;

      const p = Math.min(Math.max(progress, 0), 1);

      // cinematic easing
      const eased = 1 - Math.pow(1 - p, 3);

      splineRef.current.setVariable("progress", eased);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoaded]);

  return (
    <div className="fixed inset-0 z-0">
      <Spline
        onLoad={onLoad}
        scene="https://prod.spline.design/5U0KUgj3xBsmfox8/scene.splinecode"
      />
    </div>
  );
}