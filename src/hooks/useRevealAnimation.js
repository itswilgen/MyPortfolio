import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../animations/gsapConfig";
import { motionTokens } from "../animations/motionTokens";

export function useRevealAnimation({
  threshold = 0.1,
  direction = "up",
  distance = motionTokens.distance.standard,
  duration = motionTokens.duration.section,
  stagger = motionTokens.stagger.standard,
  ease = motionTokens.ease.emphasized,
  markers = false,
  start = "top 85%"
} = {}) {
  const containerRef = useRef(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        normalMotion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion, normalMotion } = context.conditions;

        if (reduceMotion) {
          gsap.set(containerRef.current, { opacity: 1 });
          const items = containerRef.current.querySelectorAll(".reveal-item");
          if (items.length) {
            gsap.set(items, { opacity: 1 });
          }
          return;
        }

        if (normalMotion) {
          const items = containerRef.current.querySelectorAll(".reveal-item");
          const hasItems = items.length > 0;
          
          let y = 0;
          let x = 0;
          if (direction === "up") y = distance;
          if (direction === "down") y = -distance;
          if (direction === "left") x = distance;
          if (direction === "right") x = -distance;

          if (hasItems) {
            gsap.fromTo(
              items,
              { opacity: 0, y, x },
              {
                opacity: 1,
                y: 0,
                x: 0,
                duration,
                ease,
                stagger,
                scrollTrigger: {
                  trigger: containerRef.current,
                  start,
                  markers,
                },
              }
            );
          } else {
            gsap.fromTo(
              containerRef.current,
              { opacity: 0, y, x },
              {
                opacity: 1,
                y: 0,
                x: 0,
                duration,
                ease,
                scrollTrigger: {
                  trigger: containerRef.current,
                  start,
                  markers,
                },
              }
            );
          }
        }
      }
    );

    return () => mm.revert();
  }, { scope: containerRef });

  return containerRef;
}
