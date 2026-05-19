"use client";

import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="fixed right-3 top-0 bottom-0 w-px z-50 pointer-events-none flex flex-col items-center">
      <div
        className="w-px bg-gradient-to-b from-primary via-secondary to-primary origin-top"
        style={{ transform: `scaleY(${progress})`, height: "100%" }}
      />
    </div>
  );
}
