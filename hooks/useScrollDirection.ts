"use client";

import { useEffect, useState } from "react";

export function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const update = () => {
      const scrollY = window.scrollY;
      setIsAtTop(scrollY < 10);

      if (scrollY > lastScrollY && scrollY > 50) {
        setDirection("down");
      } else if (scrollY < lastScrollY) {
        setDirection("up");
      }
      lastScrollY = scrollY;
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return { direction, isAtTop };
}
