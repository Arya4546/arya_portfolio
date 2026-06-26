import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
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
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition-colors duration-700">
      <Preloader />
      <CustomCursor />
      <Navbar />
      <Hero />

      {/* Main Content Sections that will overlap the fixed Hero */}
      <div className="relative z-10 pointer-events-none">
        {/* Spacer to allow Hero to be seen initially */}
        <div className="h-screen pointer-events-none" />

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
