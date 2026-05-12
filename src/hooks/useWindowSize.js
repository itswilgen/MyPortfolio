import { useEffect, useState } from "react";

/**
 * Returns { width, height, isMobile, isTablet, isDesktop }
 * Debounced at 150ms to avoid excessive re-renders on resize.
 */
export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    let timer;

    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return {
    ...size,
    isMobile: size.width < 640,
    isTablet: size.width >= 640 && size.width < 1024,
    isDesktop: size.width >= 1024,
  };
}
