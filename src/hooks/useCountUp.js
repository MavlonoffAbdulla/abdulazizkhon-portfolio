import { useState, useEffect, useRef } from "react";

export default function useCountUp(target, duration = 1500, trigger = false) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);

  useEffect(() => {
    if (!trigger) return;

    let start = null;
    const end = parseInt(target, 10);
    if (isNaN(end)) {
      setCount(target);
      return;
    }

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out quad animation
      const easedProgress = progress * (2 - progress);
      const current = Math.floor(easedProgress * end);
      
      setCount(current);
      countRef.current = current;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [target, duration, trigger]);

  return count;
}
