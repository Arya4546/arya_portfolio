import { motion } from 'framer-motion';
import SkillsGravity from './SkillsGravity';

const TechStack = () => {
    return (
        <section className="bg-background py-20 md:py-32 lg:py-48 overflow-hidden relative">
            <div className="px-6 md:px-24 mb-12 md:mb-20">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-foreground/40 mb-6 md:mb-8 block"
                >
                    Capabilities
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-[10vw] font-serif leading-[1.1] md:leading-none italic text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50 tracking-tight"
                >
                    Modern <br /> Architectures.
                </motion.h2>
            </div>

            <div className="px-6 md:px-24">
                <SkillsGravity />
            </div>
        </section>
    );
};

export default TechStack;
