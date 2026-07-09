import { useEffect, useRef } from "react";

// Тонкая градиентная полоса прогресса скролла вверху страницы.
// Обновляется через transform: scaleX напрямую — без ре-рендеров React.
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      el.style.transform = `scaleX(${Math.min(progress, 1)})`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-0.5 z-[60] origin-left scale-x-0 bg-gradient-to-r from-primary via-primary-bright to-[#7DD3FC] shadow-glow pointer-events-none"
    />
  );
}
