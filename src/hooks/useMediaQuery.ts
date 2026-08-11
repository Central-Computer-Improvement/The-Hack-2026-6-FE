"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  // Func subscribe ke perubahan media query
  const subscribe = (callback: (e: MediaQueryListEvent) => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", callback);
    return () => media.removeEventListener("change", callback);
  };

  // get nilai saat ini di browser (Client-side)
  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  // func fallback untuk Next.js Server-Side Rendering
  const getServerSnapshot = () => {
    return false;
  };

  // hook React 18+
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}