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

  // The current Spline scene does not have a "progress" variable configured,
  // so we remove the scroll listener to prevent console errors and improve performance.


  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh]">
        <Spline
          onLoad={onLoad}
          scene="https://prod.spline.design/5U0KUgj3xBsmfox8/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}