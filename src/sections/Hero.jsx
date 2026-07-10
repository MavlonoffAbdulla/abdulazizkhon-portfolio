import React, { useState, useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";
import useContacts from "../hooks/useContacts";
import StaticWatermark from "../components/StaticWatermark";
import useTypewriter from "../hooks/useTypewriter";
import useMagnetic from "../hooks/useMagnetic";
import InteractiveBackground from "../components/InteractiveBackground";

// Lazy load 3D scene to keep it out of the main bundle
const ThreeDHeroScene = React.lazy(() => import("./ThreeDHeroScene"));

function isWebGLAvailable() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}

export default function Hero() {
  const { t } = useTranslation();
  const contacts = useContacts();
  const primaryBtnRef = useMagnetic(0.25);
  const secondaryBtnRef = useMagnetic(0.25);

  // Последнее слово заголовка — градиентный акцент (см. DESIGN.md: акцентные слова в заголовках)
  const heroTitle = t("hero.title");
  const titleWords = heroTitle.split(" ");
  const titleLead = titleWords.slice(0, -1).join(" ");
  const titleAccent = titleWords[titleWords.length - 1];

  // Печатающийся текст ролей (ротация: ERP/CRM, боты, AI…)
  const roles = t("hero.roles", { returnObjects: true });
  const typedRole = useTypewriter(Array.isArray(roles) ? roles : []);

  const [shouldShow3D, setShouldShow3D] = useState(false);
  const [enableParallax, setEnableParallax] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  // 1. Delay 3D scene loading until the window is fully loaded & browser is idle
  useEffect(() => {
    const handleLoad = () => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => setPageLoaded(true));
      } else {
        setTimeout(() => setPageLoaded(true), 250);
      }
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  // 2. Perform capability check after page is completely loaded
  useEffect(() => {
    if (!pageLoaded) return;

    const checkCapabilities = () => {
      const isMobileScreen = window.matchMedia("(max-width: 767px)").matches;
      const isParallaxScreen = window.matchMedia("(min-width: 1024px)").matches;
      const isPowerful =
        navigator.hardwareConcurrency === undefined ||
        navigator.hardwareConcurrency >= 2; // iOS limitations (reports 2 or 4 cores for fingerprint protection)
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const webGL = isWebGLAvailable();

      // Enforce simplified 3D on mobile, keeping static logo only for weak/no-webgl/no-motion
      setShouldShow3D(isPowerful && !prefersReducedMotion && webGL);
      setEnableParallax(isParallaxScreen);
      setIsMobile(isMobileScreen);
    };

    checkCapabilities();

    const handleResize = () => {
      checkCapabilities();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pageLoaded]);

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-4rem)] flex items-center bg-bg overflow-hidden py-16 md:py-24 scroll-mt-20"
    >
      {/* Background Circuit Pattern (opacity 0.08, color primary-bright) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-8">
        <svg className="w-full h-full text-primary-bright" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" width="240" height="240" patternUnits="userSpaceOnUse">
              <path d="M 30 30 L 90 30 L 110 50 L 180 50" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="30" cy="30" r="3.5" fill="currentColor" />
              <circle cx="180" cy="50" r="3.5" fill="currentColor" />
              <path d="M 60 140 L 80 160 L 160 160 L 180 180" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="60" cy="140" r="3.5" fill="currentColor" />
              <circle cx="180" cy="180" r="3.5" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      {/* Interactive Background Canvas */}
      <InteractiveBackground />

      {/* Desktop/Tablet Background: 3D Scene or Watermark */}
      {!isMobile && (
        shouldShow3D ? (
          <Suspense fallback={<StaticWatermark isMobile={false} />}>
            <ThreeDHeroScene enableParallax={enableParallax} isMobile={false} />
          </Suspense>
        ) : (
          <StaticWatermark isMobile={false} />
        )
      )}

      {/* Hero Content Grid (Text left 55%, empty right 45% on desktop to prevent overlaps) */}
      <div className="relative max-w-6xl w-full mx-auto px-4 z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="w-full lg:w-[55%] text-center lg:text-left flex flex-col items-center lg:items-start">
          
          {/* Mobile-only standalone Logo block (w-[78vw] max-w-[380px], infinite floating and glowing) */}
          {isMobile && (
            <div className="w-[78vw] max-w-[380px] h-[78vw] max-h-[380px] mb-8 flex items-center justify-center pointer-events-none relative animate-float-glow">
              {shouldShow3D ? (
                <Suspense fallback={<StaticWatermark isMobile={true} />}>
                  <ThreeDHeroScene enableParallax={false} isMobile={true} />
                </Suspense>
              ) : (
                <StaticWatermark isMobile={true} />
              )}
            </div>
          )}

          {/* Main Badge / Small text (пульсирующая точка — «живой» статус) */}
          <span className="inline-flex items-center gap-2.5 text-xs md:text-sm font-semibold text-primary-bright bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-wider shadow-glow">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-bright opacity-75 motion-reduce:animate-none"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-bright"></span>
            </span>
            {t("nav.cta")}
          </span>

          {/* H1 Heading (последнее слово — градиент с шиммером) */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-ink tracking-tight leading-tight mb-6">
            {titleLead}{titleLead ? " " : ""}
            <span className="text-gradient">{titleAccent}</span>
          </h1>

          {/* Typewriter: ротация ролей с мигающим курсором */}
          <div className="flex items-center justify-center lg:justify-start gap-2.5 text-lg md:text-2xl font-semibold mb-6 min-h-[2rem] md:min-h-[2.25rem]">
            <span className="text-muted">{t("hero.rolePrefix")}</span>
            <span className="text-primary-bright">{typedRole}</span>
            <span className="typed-caret" aria-hidden="true"></span>
          </div>

          {/* Subtitle */}
          <p className="max-w-2xl text-muted text-lg md:text-xl leading-relaxed mb-10">
            {t("hero.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto">
            <a
              href="#portfolio"
              ref={primaryBtnRef}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-bright hover:shadow-glow font-semibold text-base transition-all duration-200 text-center"
            >
              {t("hero.ctaPrimary")}
            </a>
            <a
              href={contacts.telegramDeepLink(t("hero.title"))}
              target="_blank"
              rel="noopener noreferrer"
              ref={secondaryBtnRef}
              className="w-full sm:w-auto px-8 py-4 border border-primary text-primary-bright hover:bg-primary/10 rounded-lg font-semibold text-base transition-all duration-200 text-center"
            >
              {t("hero.ctaSecondary")}
            </a>
          </div>
        </div>

        {/* Empty placeholder area on the right side to reserve layout spacing */}
        <div className="hidden lg:block lg:w-[40%] h-[28rem] xl:h-[32rem] pointer-events-none" />
      </div>
    </section>
  );
}
