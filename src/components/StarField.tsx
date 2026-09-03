"use client";

import { useMemo } from "react";

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/**
 * The night sky behind the transcript.
 *
 * @remarks Seeded rather than random, so the server and the browser lay the same sky and hydration
 * has nothing to argue about. Each star carries its own brightness as a custom property, because
 * the animation has to fade back to the brightness of that one star rather than to a shared value.
 * The field is not painted in light: the page gradient carries the whole atmosphere there, and a
 * field faded to nothing is still a field being animated.
 */
export function StarField() {
  const stars = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: 160 }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      size: rand() < 0.82 ? 1 : rand() < 0.94 ? 1.5 : 2.5,
      opacity: 0.25 + rand() * 0.5,
      delay: rand() * 5,
      duration: 3 + rand() * 4,
    }));
  }, []);

  return (
    <div className="starfield pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {stars.map((star, index) => (
        <div
          key={index}
          className="star bg-foreground absolute rounded-full"
          style={
            {
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              "--star-opacity": star.opacity,
              opacity: star.opacity,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
