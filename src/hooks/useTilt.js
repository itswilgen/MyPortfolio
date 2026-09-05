import { useCallback, useRef } from "react";

/**
 * Hook for hardware-accelerated 3D tilt and specular glare effect.
 * @param {Object} options
 * @param {number} options.max - Max tilt rotation in degrees (default: 7)
 * @param {number} options.scale - Scale factor on hover (default: 1.015)
 * @param {number} options.perspective - Perspective in px (default: 1000)
 */
export function useTilt({ max = 7, scale = 1.015, perspective = 1000 } = {}) {
  const elementRef = useRef(null);
  const frameRef = useRef(null);

  const handlePointerMove = useCallback(
    (event) => {
      if (
        typeof window === "undefined" ||
        window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)")
          .matches
      ) {
        return;
      }

      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
      const yPercent = (y / rect.height - 0.5) * 2; // -1 to 1

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const rotateX = -yPercent * max;
        const rotateY = xPercent * max;

        element.style.setProperty(
          "--tilt-rotate-x",
          `${rotateX.toFixed(2)}deg`,
        );
        element.style.setProperty(
          "--tilt-rotate-y",
          `${rotateY.toFixed(2)}deg`,
        );
        element.style.setProperty("--tilt-scale", `${scale}`);
        element.style.setProperty(
          "--glare-x",
          `${((x / rect.width) * 100).toFixed(1)}%`,
        );
        element.style.setProperty(
          "--glare-y",
          `${((y / rect.height) * 100).toFixed(1)}%`,
        );
        element.style.setProperty("--glare-opacity", "1");
        element.style.setProperty("--perspective", `${perspective}px`);
      });
    },
    [max, scale, perspective],
  );

  const handlePointerLeave = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    element.style.setProperty("--tilt-rotate-x", "0deg");
    element.style.setProperty("--tilt-rotate-y", "0deg");
    element.style.setProperty("--tilt-scale", "1");
    element.style.setProperty("--glare-opacity", "0");
  }, []);

  return {
    ref: elementRef,
    onPointerMove: handlePointerMove,
    onPointerLeave: handlePointerLeave,
  };
}
