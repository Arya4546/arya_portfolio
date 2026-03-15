import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import portfolioImg from '../assets/portfolio.jpeg';

const About = () => {
    const container = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start start", "end end"]
    });

    const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const textY = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80, 0, 0, -80]);
    const videoY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

    return (
        <section id="about" ref={container} className="relative bg-background min-h-[180vh] z-20 shadow-[0_-50px_100px_rgba(0,0,0,0.05)]">
            <div className="sticky top-0 min-h-screen flex flex-col md:flex-row items-center overflow-hidden">
                {/* Left Side - Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-24 py-20 md:py-0 z-10">
                    <motion.div
                        style={{ opacity: textOpacity, y: textY }}
                        className="max-w-xl"
                    >
                        <span className="text-xs uppercase tracking-[0.4em] text-foreground/40 mb-6 md:mb-8 block font-mono italic">the narrative — 01</span>
                        <h2 className="text-5xl md:text-[6.5vw] mb-8 md:mb-12 leading-[1] font-serif">
                            A journey through <br /> <span className="italic font-light">pixels & logic.</span>
                        </h2>
                        <div className="space-y-6 md:space-y-8 text-base md:text-xl text-foreground/70 leading-relaxed">
                            <p>
                                Driven by the intersection of design and data, I craft technical excellence through
                                cinematic digital experiences and robust engineering.
                            </p>
                            <div className="pt-8 md:pt-12 grid grid-cols-2 gap-8 md:gap-12 border-t border-foreground/10">
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-foreground/30 block mb-2 md:mb-4">Vision</span>
                                    <p className="font-serif italic text-2xl md:text-4xl text-foreground">Aesthetic Code</p>
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase tracking-widest text-foreground/30 block mb-2 md:mb-4">Mission</span>
                                    <p className="font-serif italic text-2xl md:text-4xl text-foreground">Digital Elegance</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Visuals */}
                <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative flex items-center justify-center">
                    <motion.div
                        style={{ y: videoY }}
                        className="relative w-[80%] aspect-[4/5] md:aspect-square md:w-[60%] lg:w-[50%] bg-black rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-foreground/5 shadow-2xl group cursor-pointer"
                    >
                        <div className="absolute inset-0 bg-black overflow-hidden">
                            <img
                                src={portfolioImg}
                                alt="Arya Deep Singh"
                                className="w-full h-full object-cover object-top opacity-70 grayscale-[0.8] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
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
