import { motion } from 'framer-motion';

const tech = {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind", "Three.js", "Framer Motion"],
    backend: ["Node.js", "Express", "Python", "Flask", "Go"],
    database: ["PostgreSQL", "MongoDB", "Redis", "Firebase", "Prisma"],
    tools: ["Docker", "AWS", "Git", "Vercel", "Linux"]
};

const TechStack = () => {
    return (
        <section className="bg-background py-20 md:py-32 lg:py-48 overflow-hidden relative">
            <div className="px-6 md:px-24 mb-20 md:mb-32">
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

            <div className="flex flex-col gap-6 md:gap-12">
                <Marquee items={tech.frontend} speed={40} />
                <Marquee items={tech.backend} speed={30} reverse />
                <Marquee items={tech.database} speed={35} />
                <Marquee items={tech.tools} speed={25} reverse />
            </div>
        </section>
    );
};

interface MarqueeProps {
    items: string[];
    speed: number;
    reverse?: boolean;
}

const Marquee = ({ items, speed, reverse = false }: MarqueeProps) => {
    return (
        <div className="flex overflow-hidden group select-none py-3 md:py-4 border-y border-foreground/5 bg-accent/5 backdrop-blur-sm">
            <motion.div
                animate={{ x: reverse ? [0, 500] : [0, -500] }}
                transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
                className="flex gap-10 md:gap-20 px-4 md:px-10 items-center whitespace-nowrap"
            >
                {[...items, ...items, ...items].map((item, i) => (
                    <div key={i} className="flex items-center gap-10 md:gap-20">
                        <span className="text-3xl sm:text-4xl md:text-[6vw] font-serif text-foreground/40 hover:text-foreground transition-all duration-700 cursor-default hover:italic">
                            {item}
                        </span>
                        <div className="w-2 h-2 md:w-4 md:h-4 rounded-full bg-foreground/20 rotate-45" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default TechStack;
