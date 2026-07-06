import React, { useState, useEffect, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { contacts } from "../data/contacts";
import StaticWatermark from "../components/StaticWatermark";

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
  const [shouldShow3D, setShouldShow3D] = useState(false);
  const [enableParallax, setEnableParallax] = useState(false);

  useEffect(() => {
    const checkCapabilities = () => {
      const isLargeScreen = window.matchMedia("(min-width: 768px)").matches;
      const isParallaxScreen = window.matchMedia("(min-width: 1024px)").matches;
      const isPowerful =
        navigator.hardwareConcurrency === undefined ||
        navigator.hardwareConcurrency > 4;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const webGL = isWebGLAvailable();

      setShouldShow3D(isLargeScreen && isPowerful && !prefersReducedMotion && webGL);
      setEnableParallax(isParallaxScreen);
    };

    checkCapabilities();

    const handleResize = () => {
      checkCapabilities();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white overflow-hidden py-16 md:py-24 scroll-mt-20"
    >
      {/* Background: 3D Scene (Lazy Loaded) or Static Fallback Watermark */}
      {shouldShow3D ? (
        <Suspense fallback={<StaticWatermark />}>
          <ThreeDHeroScene enableParallax={enableParallax} />
        </Suspense>
      ) : (
        <StaticWatermark />
      )}

      {/* Hero Content */}
      <div className="relative max-w-6xl mx-auto px-4 text-center z-10">
        {/* Main Badge / Small text */}
        <span className="inline-block text-xs md:text-sm font-semibold text-primary bg-primary-light px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-wider">
          {t("nav.cta")}
        </span>

        {/* H1 Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold text-ink tracking-tight leading-none mb-6">
          {t("hero.title")}
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-muted text-lg md:text-xl leading-relaxed mb-10">
          {t("hero.subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#portfolio"
            className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark font-semibold text-base transition-colors duration-200 text-center shadow-sm"
          >
            {t("hero.ctaPrimary")}
          </a>
          <a
            href={contacts.telegramDeepLink(t("hero.title"))}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 border border-primary text-primary hover:bg-primary-light rounded-lg font-semibold text-base transition-colors duration-200 text-center"
          >
            {t("hero.ctaSecondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
