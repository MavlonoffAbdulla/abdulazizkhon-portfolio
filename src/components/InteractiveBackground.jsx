import { useEffect, useRef } from "react";

export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null, active: false, radius: 130 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // При reduced-motion не анимируем — статичный circuit-паттерн уже есть
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let running = true;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 80;

    // Цвет из CSS-переменной темы: там RGB-триплет ("94 162 255"),
    // конвертируем в валидный для canvas "rgb(94, 162, 255)"
    const readThemeColor = () => {
      try {
        const raw = getComputedStyle(document.documentElement)
          .getPropertyValue("--color-primary-bright")
          .trim();
        if (/^\d+\s+\d+\s+\d+$/.test(raw)) {
          return `rgb(${raw.split(/\s+/).join(", ")})`;
        }
        return raw || "#5ea2ff";
      } catch {
        return "#5ea2ff";
      }
    };

    // Кэшируем цвет и обновляем только при смене темы (ThemeSwitcher
    // пишет переменные в style атрибут <html>)
    let themeColor = readThemeColor();
    const themeObserver = new MutationObserver(() => {
      themeColor = readThemeColor();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"]
    });

    // Resize handler (start объявлен ниже — вызывается только из слушателя)
    const resizeCanvas = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      initParticles();
      // После смены размеров перезапускаем цикл, если он был остановлен
      // (например, наблюдатель успел выключить его при нулевом вьюпорте)
      if (canvas.width > 0 && !document.hidden) start();
    };

    // Initialize particles
    class Particle {
      constructor(w, h) {
        this.w = w;
        this.h = h;
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1.5;
        this.originalRadius = this.radius;
      }

      update(mouse) {
        // Normal drift movement
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off canvas edges
        if (this.x < 0 || this.x > this.w) this.vx *= -1;
        if (this.y < 0 || this.y > this.h) this.vy *= -1;

        // Mouse/Touch avoidance logic (magnetic push)
        if (mouse.active && mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            // Angle from mouse to particle
            const angle = Math.atan2(dy, dx);
            // Push intensity
            const pushX = Math.cos(angle) * force * 3.5;
            const pushY = Math.sin(angle) * force * 3.5;

            // Apply displacement smoothly
            this.x += pushX;
            this.y += pushY;
            this.radius = this.originalRadius * (1 + force * 0.8);
          } else {
            // Return to normal size
            if (this.radius > this.originalRadius) {
              this.radius -= 0.05;
            }
          }
        } else {
          if (this.radius > this.originalRadius) {
            this.radius -= 0.05;
          }
        }
      }

      draw(context, color) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = color;
        context.shadowBlur = this.radius > this.originalRadius ? 8 : 0;
        context.shadowColor = color;
        context.fill();
        context.shadowBlur = 0; // reset
      }
    }

    const initParticles = () => {
      particles = [];
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(w, h));
      }
    };

    // Tracking mouse & touch events
    const parent = canvas.parentElement;

    const handleMouseMove = (e) => {
      const rect = parent.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const rect = parent.getBoundingClientRect();
        mouseRef.current.x = e.touches[0].clientX - rect.left;
        mouseRef.current.y = e.touches[0].clientY - rect.top;
        mouseRef.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    parent.addEventListener("mousemove", handleMouseMove, { passive: true });
    parent.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    parent.addEventListener("touchmove", handleTouchMove, { passive: true });
    parent.addEventListener("touchend", handleTouchEnd, { passive: true });

    // Animation Loop
    const drawConnections = (color) => {
      const maxDistance = window.innerWidth < 768 ? 75 : 95;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.13;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.6;
            ctx.globalAlpha = opacity;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }
    };

    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((p) => {
        p.update(mouseRef.current);
        p.draw(ctx, themeColor);
      });

      // Draw connections
      drawConnections(themeColor);

      animationFrameId = requestAnimationFrame(loop);
    };

    // Пауза, когда hero вне вьюпорта или вкладка скрыта — не жжём GPU зря
    const start = () => {
      if (!running) {
        running = true;
        loop();
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(animationFrameId);
    };

    const visObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.05 }
    );
    visObserver.observe(canvas);

    const handleVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", handleVisibility);

    // Start
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    loop();

    return () => {
      stop();
      themeObserver.disconnect();
      visObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", resizeCanvas);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      parent.removeEventListener("touchmove", handleTouchMove);
      parent.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
