import { useEffect, useState } from "react";

// Прелоадер: градиентный логотип A.M. + полоса загрузки с процентами.
// Прогресс ползёт до 90% пока страница грузится, после window.load — до 100% и fade-out.
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let current = 0;
    let loaded = document.readyState === "complete";
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener("load", onLoad);

    const timer = setInterval(() => {
      const target = loaded ? 100 : 90;
      current = Math.min(current + Math.random() * 10 + 4, target);
      setProgress(Math.floor(current));

      if (current >= 100) {
        clearInterval(timer);
        setTimeout(() => setFading(true), 250);
        setTimeout(() => setHidden(true), 1050);
      }
    }, 90);

    return () => {
      clearInterval(timer);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // Блокируем скролл, пока прелоадер виден
  useEffect(() => {
    if (hidden) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      role="status"
      aria-label="Загрузка"
      className={`fixed inset-0 z-[100] bg-bg grid place-items-center transition-opacity duration-700 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <span className="text-gradient font-extrabold text-5xl md:text-6xl tracking-wide animate-pulse motion-reduce:animate-none">
          A.M.
        </span>
        <div className="w-44 h-0.5 bg-borderSoft rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-primary-bright to-gradEnd shadow-glow transition-[width] duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-mono text-xs text-muted">{progress}%</span>
      </div>
    </div>
  );
}
