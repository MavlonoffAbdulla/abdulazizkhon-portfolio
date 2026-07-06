import { useEffect, useRef } from "react";

export default function useTilt(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Check prefers-reduced-motion and touch device capability
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    if (prefersReducedMotion || isTouchDevice) {
      return; // Do not apply tilt
    }

    const settings = {
      max: 6, // max tilt rotation (degrees)
      perspective: 1000, // transform perspective
      speed: 300, // transition speed
      easing: "cubic-bezier(.03,.98,.52,.99)", // transition easing
      ...options
    };

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const left = rect.left;
      const top = rect.top;

      // Mouse coordinates relative to card center, normalized between -0.5 and 0.5
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      // Calculate rotation angles
      const rotateX = -y * settings.max;
      const rotateY = x * settings.max;

      // Apply style
      el.style.transform = `perspective(${settings.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const onMouseEnter = () => {
      el.style.transition = "none";
    };

    const onMouseLeave = () => {
      el.style.transition = `transform ${settings.speed}ms ${settings.easing}`;
      el.style.transform = `perspective(${settings.perspective}px) rotateX(0deg) rotateY(0deg)`;
    };

    const onClick = () => {
      el.style.transition = `transform ${settings.speed}ms ${settings.easing}`;
      el.style.transform = `perspective(${settings.perspective}px) rotateX(0deg) rotateY(0deg)`;
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("click", onClick);

    // Set initial transform properties
    el.style.willChange = "transform";
    el.style.transform = `perspective(${settings.perspective}px) rotateX(0deg) rotateY(0deg)`;

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("click", onClick);

      // Reset style
      el.style.transform = "";
      el.style.transition = "";
      el.style.willChange = "";
    };
  }, [options]);

  return ref;

}
