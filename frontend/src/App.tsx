import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LiveStatusWidget from './components/LiveStatusWidget';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import TechStack from './components/TechStack';
import Experience from './components/Experience';
import Contact from './components/Contact';

function App() {
  useEffect(() => {
    let lenis: InstanceType<typeof Lenis> | null = null;
    let rafId: number | null = null;

    const raf = (time: number) => {
      lenis?.raf(time);
      if (!document.hidden) {
        rafId = requestAnimationFrame(raf);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden && lenis) {
        rafId = requestAnimationFrame(raf);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Delay Lenis start until AFTER the preloader is completely gone (2s timer + 1.5s exit animation).
    // This prevents Lenis from conflicting with iOS Safari's scroll context during the initial load.
    const initTimer = setTimeout(() => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: true,
        touchMultiplier: 1.5,
      });

      (window as any).__lenis = lenis;
      rafId = requestAnimationFrame(raf);
    }, 3600);

    return () => {
      clearTimeout(initTimer);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (rafId != null) cancelAnimationFrame(rafId);
      if (lenis) {
        delete (window as any).__lenis;
        lenis.destroy();
      }
    };
  }, []);

  return (
    <main className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition-colors duration-700">
      <Preloader />
      <CustomCursor />
      <Navbar />
      <LiveStatusWidget />
      <Hero />

      {/* Main Content Sections that will overlap the fixed Hero */}
      <div className="relative z-10 pointer-events-none">
        {/* Spacer to allow Hero to be seen initially */}
        <div className="hidden lg:block lg:h-screen pointer-events-none" />

        <div className="pointer-events-auto">
          <About />
          <Services />
          <Projects />
          <TechStack />
          <Experience />
          <Contact />
        </div>
      </div>
    </main>
  );
}

export default App;
