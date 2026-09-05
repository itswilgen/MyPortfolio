import { useEffect, useRef } from "react";

export default function AmbientBackground() {
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)")
        .matches
    ) {
      return;
    }

    let frameId = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 3;
    let currentX = targetX;
    let currentY = targetY;

    const handlePointerMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const animate = () => {
      // Smooth lerp interpolation for silky motion
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      if (spotlightRef.current) {
        spotlightRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="ambient-background" aria-hidden="true">
      {/* Interactive mouse cursor spotlight aura */}
      <div ref={spotlightRef} className="ambient-spotlight" />

      {/* Floating ambient atmospheric glow orbs */}
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />

      {/* Subtle modern architectural tech grid */}
      <div className="ambient-grid-overlay" />
    </div>
  );
}
