import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import HeroVisuals from './HeroVisuals';
import Magnetic from './Magnetic';

const Hero = () => {
    return (
        <section className="fixed inset-0 h-[100dvh] flex items-center justify-center overflow-hidden bg-background pt-32 lg:pt-0 pb-20 lg:pb-0">
            {/* Subtle background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <motion.div
                className="container mx-auto px-6 relative z-10 w-full"
            >
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

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
                        <h1 className="text-[14vw] md:text-[8vw] lg:text-[7rem] leading-[1] md:leading-[0.9] font-serif mb-4 lg:mb-8 italic whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/50 pb-2 lg:pb-4">
                            Arya <br /> Deep Singh
                        </h1>
                        <div className="flex flex-col w-full gap-6 lg:gap-8">
                            <p className="text-base md:text-xl lg:text-2xl text-foreground/60 font-sans leading-relaxed max-w-xl">
                                Software Developer crafting technical excellence through
                                <span className="text-foreground"> cinematic digital experiences </span>
                                and robust engineering.
                            </p>
                            <div>
                                <Magnetic intensity={0.2}>
                                    <motion.button
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
                                    </motion.button>
                                </Magnetic>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right side Visual */}
                    <div className="flex lg:col-span-5 justify-center lg:justify-end items-center w-full mt-4 lg:mt-0">
                        <HeroVisuals />
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
