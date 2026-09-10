import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import aryaImg from '../assets/arya.png';

const About = () => {
    const container = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"]
    });

    // Subtle parallax for the image while scrolling past
    const videoY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

    return (
        <section id="about" ref={container} className="relative bg-background z-20 shadow-[0_-30px_80px_rgba(0,0,0,0.1)] w-full overflow-hidden border-t border-foreground/10 rounded-t-[2.5rem] md:rounded-t-[4rem] -mt-6 md:-mt-10">
            {/* Ambient Top Glow to separate from Hero */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center overflow-visible py-24 md:py-32 max-w-7xl mx-auto w-full">
                {/* Left Side - Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-24 py-8 md:py-0 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                >
                                    <span className="text-[10px] uppercase tracking-widest text-foreground/40 block mb-1.5 md:mb-3 font-mono">Vision</span>
                                    <p className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground">Aesthetic Code</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                >
                                    <span className="text-[10px] uppercase tracking-widest text-foreground/40 block mb-1.5 md:mb-3 font-mono">Mission</span>
                                    <p className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-foreground">Digital Elegance</p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Visuals */}
                <div className="w-full md:w-1/2 h-[50vh] sm:h-[60vh] md:h-screen relative flex items-center justify-center mt-12 md:mt-0 pb-12 md:pb-0">
                    <motion.div
                        style={{ y: videoY }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="relative w-[75%] sm:w-[60%] md:w-[65%] lg:w-[55%] aspect-[4/5] md:aspect-square bg-black rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-foreground/10 shadow-2xl group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-black overflow-hidden">
                            <img
                                src={aryaImg}
                                alt="Arya Deep Singh - Backend Developer from Noida, India"
                                loading="lazy"
                                className="w-full h-full object-cover object-top opacity-90 transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:opacity-100"
                            />
                        </div>
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2rem] md:rounded-[3rem] pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
