import { useEffect, useRef, useState } from "react";

/**
 * Returns [ref, isInView].
 * Once the element enters the viewport it stays "in view" (one-shot).
 * @param {number} threshold - 0 to 1, portion of element visible before trigger
 */
export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // fire only once
        }
      },
      { threshold }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}
