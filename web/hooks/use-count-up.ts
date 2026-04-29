"use client";

import { useEffect, useRef, useState } from "react";

export function useCountUp(value: number, duration = 400) {
  const [display, setDisplay] = useState(value);
  const displayRef = useRef(value);

  useEffect(() => {
    const start = displayRef.current;
    const delta = value - start;
    if (delta === 0) return;
    let frame = 0;
    let raf = 0;
    const totalFrames = Math.max(1, Math.round(duration / 16));

    const tick = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const next = Math.round(start + delta * eased);
      displayRef.current = next;
      setDisplay(next);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, value]);

  return display;
}
