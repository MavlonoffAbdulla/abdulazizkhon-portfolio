import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import Preloader from "./components/Preloader";
import ScrollProgress from "./components/ScrollProgress";
import ScrollToTop from "./components/ScrollToTop";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Timeline from "./sections/Timeline";
import Services from "./sections/Services";
import Portfolio from "./sections/Portfolio";
import TechStack from "./sections/TechStack";
import Process from "./sections/Process";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./sections/AdminPanel";
import { trackVisitOnce } from "./utils/analytics";

export default function App() {
  const { t, i18n } = useTranslation();
  const isAdmin = window.location.pathname === "/admin";

  // Dynamic Page Title & Meta Description Localization
  useEffect(() => {
    document.title = isAdmin ? "Панель администратора" : t("meta.title");
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", isAdmin ? "Управление сайтом" : t("meta.description"));
    }
  }, [t, i18n.language, isAdmin]);

  // Счётчик посещений (раз за сессию, админку не считаем)
  useEffect(() => {
    if (!isAdmin) trackVisitOnce(i18n.language);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  if (isAdmin) {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-white text-ink font-sans selection:bg-primary-light selection:text-primary">
      <Preloader />
      <ScrollProgress />
      <ScrollToTop />
      <Header />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Services />
        <Portfolio />
        <TechStack />
        <Process />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
