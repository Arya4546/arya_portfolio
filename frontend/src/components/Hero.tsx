import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Magnetic from './Magnetic';
import NameParticles from './NameParticles';
import aryaImg from '../assets/arya.png';

// Paragraph reveal is a plain typographic cascade (not particle-based) so it
// stays real, readable, selectable text — it just plays right after the name
// finishes assembling, using the same easing curve as the rest of the site.
const paragraphSegments = [
    { text: 'Software Developer crafting technical excellence through', emphasis: false },
    { text: 'cinematic digital experiences', emphasis: true },
    { text: 'and robust engineering.', emphasis: false },
];

const paragraphWords = paragraphSegments.flatMap(({ text, emphasis }) =>
    text.split(' ').map((word) => ({ word, emphasis }))
);

const prefersReducedMotion =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const paragraphContainerVariants: Variants = {
    hidden: {},
    visible: {
        transition: prefersReducedMotion ? {} : { delayChildren: 1.5, staggerChildren: 0.035 },
    },
};

const paragraphWordVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: '0.4em' },
    visible: {
        opacity: 1,
        y: 0,
        transition: prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
};

const Hero = () => {
    return (
        <section id="hero" className="relative min-h-screen lg:fixed lg:inset-0 lg:h-[100dvh] flex items-center justify-center overflow-y-auto lg:overflow-hidden bg-background pt-32 lg:pt-0 pb-24 lg:pb-0">
            {/* Subtle background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <motion.div
                className="container mx-auto px-6 relative z-10 w-full py-8 lg:py-0"
            >
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                    {/* Left side text */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:col-span-7 flex flex-col items-start"
                    >


                        <span className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-foreground/40 mb-4 lg:mb-6 leading-relaxed">
                            Available for Freelance & Internships • 1+ Year Exp.
                        </span>
                        <NameParticles />
                        <div className="flex flex-col w-full gap-6 lg:gap-8">
                            <motion.p
                                variants={paragraphContainerVariants}
                                initial="hidden"
                                animate="visible"
                                className="text-base md:text-xl lg:text-2xl text-foreground/60 font-sans leading-relaxed max-w-xl"
                            >
                                {paragraphWords.map(({ word, emphasis }, index) => (
                                    <motion.span
                                        key={`${word}-${index}`}
                                        variants={paragraphWordVariants}
                                        className={`inline-block mr-[0.28em] ${emphasis ? 'text-foreground' : ''}`}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </motion.p>
                            <div>
                                <Magnetic intensity={0.2}>
                                    <motion.a
                                        href="#projects"
                                        whileHover={{
                                            scale: 1.02,
                                            boxShadow: "0 0 40px rgba(53, 102, 60, 0.2)"
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-4 lg:px-8 lg:py-5 bg-foreground text-background rounded-full font-medium text-base lg:text-lg flex items-center gap-4 group transition-colors hover:bg-primary/90 inline-flex"
                                    >
                                        View Projects
                                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-background flex items-center justify-center group-hover:rotate-[135deg] transition-transform duration-500">
                                            <ArrowDown size={18} className="text-foreground" />
                                        </div>
                                    </motion.a>
                                </Magnetic>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side Visual */}
                    <div className="flex lg:col-span-5 justify-center lg:justify-end items-center w-full mt-4 lg:mt-0 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] rounded-full overflow-hidden border-4 border-foreground/10 shadow-2xl"
                        >
                            <img
                                src={aryaImg}
                                alt="Arya Deep Singh - Backend Developer from Noida, India"
                                className="w-full h-full object-cover object-center"
                            />
                            {/* Decorative Subtle Glow */}
                            <div className="absolute inset-0 ring-1 ring-inset ring-foreground/20 rounded-full pointer-events-none" />
                        </motion.div>
                        <div className="absolute -z-10 w-96 h-96 bg-foreground/5 rounded-full blur-[80px] pointer-events-none" />
                    </div>

                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-foreground/30">Scroll to Explore</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-[1px] h-12 bg-gradient-to-b from-foreground/20 to-transparent"
                />
            </motion.div>
        </section>
    );
};

export default Hero;
