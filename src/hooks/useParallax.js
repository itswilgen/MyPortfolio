import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../animations/gsapConfig";

export function useParallax({ scale = 1.15 } = {}) {
  const containerRef = useRef(null);
  const targetRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    // Only apply parallax on desktop/tablet where pointer is fine and screen is larger
    mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
      if (containerRef.current && targetRef.current) {
        gsap.set(targetRef.current, { scale, transformOrigin: "center center" });
        
        gsap.fromTo(targetRef.current, 
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            }
          }
        );
      }
    });

    mm.add("(prefers-reduced-motion: reduce), (max-width: 767px)", () => {
       if (targetRef.current) {
          gsap.set(targetRef.current, { scale: 1, yPercent: 0 });
       }
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return { containerRef, targetRef };
}
