"use client";

import { useMemo } from "react";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function StarField() {
  const stars = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 180 }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      size: rand() < 0.8 ? 1 : rand() < 0.93 ? 1.5 : 2.5,
      opacity: 0.3 + rand() * 0.7,
      delay: rand() * 5,
      duration: 2.5 + rand() * 4,
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      aria-hidden="true"
    >
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
