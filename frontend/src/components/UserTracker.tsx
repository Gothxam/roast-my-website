"use client";

import { useEffect } from "react";

// Declare gtag for TS
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const trackEvent = async (event: "roast" | "share") => {
  const userId = localStorage.getItem("roast_user_id");
  if (!userId) return;

  // 1. Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", event === "roast" ? "roast_complete" : "share_click", {
      user_id: userId,
    });
  }

  // 2. Backend Redis Tracking
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    await fetch(`${apiBase}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, event }),
    });
  } catch (err) {
    console.warn("Analytics tracking failed:", err);
  }
};

export default function UserTracker() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      let userId = localStorage.getItem("roast_user_id");
      if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("roast_user_id", userId);
      }
    }
  }, []);

  return null;
}
