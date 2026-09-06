import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import aryaImg from '../assets/arya.png';

const About = () => {
    const container = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"]
    });

    // Content is immediately visible when entering from landing page, smoothly transitioning at exit
    const textOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.15]);
    const textY = useTransform(scrollYProgress, [0, 0.85, 1], [0, 0, -30]);
    const videoY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);

    return (
        <section id="about" ref={container} className="relative bg-background min-h-auto md:min-h-[160vh] z-20 shadow-[0_-50px_100px_rgba(0,0,0,0.05)]">
            <div className="relative md:sticky md:top-0 min-h-screen flex flex-col md:flex-row items-center justify-center overflow-visible md:overflow-hidden py-16 md:py-0">
                {/* Left Side - Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-8 md:py-0 z-10">
                    <motion.div
                        style={{ opacity: textOpacity, y: textY }}
                        className="max-w-xl"
                    >
                        {/* Narrative Badge Indicator */}
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                            <span className="w-6 md:w-8 h-[1px] bg-primary/70" />
                            <span className="text-xs uppercase tracking-[0.3em] text-foreground/85 font-mono font-medium">
                                the narrative — 01
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[5.2vw] mb-6 md:mb-10 leading-[1.08] font-serif tracking-tight">
                            A journey through <br />
                            <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-foreground via-foreground/90 to-foreground/50">
                                pixels & logic.
                            </span>
                        </h2>

                        <div className="space-y-6 md:space-y-8 text-sm sm:text-base md:text-lg lg:text-xl text-foreground/75 leading-relaxed font-light">
                            <p>
                                I am a Backend Software Developer based in Noida/Delhi NCR. Driven by the intersection of data and scalable architecture, I specialize in Node.js, PostgreSQL, and DPDPA/GDPR privacy engineering to build secure, robust systems.
                            </p>
                            <div className="pt-6 md:pt-10 grid grid-cols-2 gap-6 md:gap-12 border-t border-foreground/10">
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-foreground/40 block mb-1.5 md:mb-3 font-mono">Vision</span>
                                    <p className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground">Aesthetic Code</p>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-foreground/40 block mb-1.5 md:mb-3 font-mono">Mission</span>
                                    <p className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground">Digital Elegance</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Visuals */}
                <div className="w-full md:w-1/2 h-[42vh] sm:h-[48vh] md:h-screen relative flex items-center justify-center mt-6 md:mt-0 pb-12 md:pb-0">
                    <motion.div
                        style={{ y: videoY }}
                        className="relative w-[70%] sm:w-[55%] md:w-[60%] lg:w-[50%] aspect-[4/5] md:aspect-square bg-black rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-foreground/10 shadow-2xl group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-black overflow-hidden">
                            <img
                                src={aryaImg}
                                alt="Arya Deep Singh - Backend Developer from Noida, India"
                                loading="lazy"
                                className="w-full h-full object-cover object-top opacity-90 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
