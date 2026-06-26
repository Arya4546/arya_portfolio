import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

const Preloader = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time or wait for actual assets
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[1000] bg-background text-foreground flex flex-col items-center justify-center overflow-hidden"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-center"
                    >
                        <span className="text-4xl md:text-6xl font-serif italic mb-4">Arya.</span>
                        <div className="w-48 h-[1px] bg-foreground/20 relative overflow-hidden">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ duration: 1.8, ease: "easeInOut" }}
                                className="absolute inset-0 bg-foreground"
                            />
                        </div>
                        <span className="mt-4 text-[10px] uppercase tracking-[0.4em] font-mono text-foreground/60">
                            Loading Experience
                        </span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
