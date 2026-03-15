import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const HeroVisuals = () => {
    const codeLines = [
        "const developer = new SoftwareEngineer({",
        "  name: 'Arya Deep Singh',",
        "  focus: 'Technical Excellence',",
        "  passion: 'Cinematic Experiences'",
        "});",
        "",
        "await developer.initialize();",
        "developer.deployAwesomeThings();"
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-lg rounded-2xl overflow-hidden border border-foreground/10 bg-accent/5 backdrop-blur-md shadow-2xl relative"
        >
            {/* Window Header */}
            <div className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 border-b border-foreground/10 bg-background/50">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80" />
                <div className="ml-auto flex items-center gap-2 text-foreground/40 text-[10px] md:text-xs font-mono lowercase">
                    <Terminal size={10} className="md:w-3 md:h-3" /> main.ts
                </div>
            </div>

            {/* Code Body */}
            <div className="p-4 md:p-6 lg:p-8 font-mono text-[11px] md:text-sm lg:text-base leading-relaxed text-foreground/80 overflow-x-auto">
                {codeLines.map((line, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                        className="flex hover:bg-foreground/5 py-0.5 px-2 -mx-2 rounded transition-colors whitespace-nowrap"
                    >
                        <span className="text-foreground/30 mr-2 md:mr-4 select-none w-3 md:w-4 text-right inline-block">{i + 1}</span>
                        {line === "" ? (
                            <span>&nbsp;</span>
                        ) : (
                            <>
                                <span className="text-primary">{line.substring(0, line.indexOf(' ') > 0 ? line.indexOf(' ') : line.length)}</span>
                                <span>{line.substring(line.indexOf(' ') > 0 ? line.indexOf(' ') : line.length)}</span>
                            </>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Decorative Subtle Glow */}
            <div className="absolute -z-10 -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        </motion.div>
    );
};

export default HeroVisuals;
