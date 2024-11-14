"use client";
// src/app/page.tsx - Server Component
import Home from "./Home";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(true);

  useEffect(() => {
    if (
      (window as typeof window & { __REACT_DEVTOOLS_GLOBAL_HOOK__?: unknown })
        .__REACT_DEVTOOLS_GLOBAL_HOOK__
    ) {
      console.log("React DevTools detected!");
      setIsDevToolsOpen(true);
    }else{
      false
    }
  }, []);

  if (isDevToolsOpen) {
    return <div>React DevTools is open. Please close it to continue.</div>;
  }

  return <Home />;
}
