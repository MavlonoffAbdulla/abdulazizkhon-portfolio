import Header from "./components/Header";
import Preloader from "./components/Preloader";
import ScrollProgress from "./components/ScrollProgress";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Services from "./sections/Services";
import Portfolio from "./sections/Portfolio";
import TechStack from "./sections/TechStack";
import Contact from "./sections/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-ink font-sans selection:bg-primary-light selection:text-primary">
      <Preloader />
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio />
        <TechStack />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
