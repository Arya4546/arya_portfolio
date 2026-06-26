import { motion } from 'framer-motion';

const tech = {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind", "Three.js", "Framer Motion"],
    backend: ["Node.js", "Express", "Python", "Flask", "Go"],
    database: ["PostgreSQL", "MongoDB", "Redis", "Firebase", "Prisma"],
    tools: ["Docker", "AWS", "Git", "Vercel", "Linux"]
};

const TechStack = () => {
    return (
        <section className="bg-background py-48 overflow-hidden relative">
            <div className="px-6 md:px-24 mb-32">
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-xs uppercase tracking-[0.4em] text-foreground/40 mb-8 block"
                >
                    Capabilities
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-7xl md:text-[10vw] font-serif leading-none italic text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50"
                >
                    Modern <br /> Architectures.
                </motion.h2>
            </div>

            <div className="flex flex-col gap-12">
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
        <div className="flex overflow-hidden group select-none py-4 border-y border-foreground/5 bg-accent/5 backdrop-blur-sm">
            <motion.div
                animate={{ x: reverse ? [0, 500] : [0, -500] }}
                transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
                className="flex gap-20 px-10 items-center whitespace-nowrap"
            >
                {[...items, ...items, ...items].map((item, i) => (
                    <div key={i} className="flex items-center gap-20">
                        <span className="text-5xl md:text-[8vw] font-serif text-foreground/40 hover:text-foreground transition-all duration-700 cursor-default hover:italic">
                            {item}
                        </span>
                        <div className="w-4 h-4 rounded-full bg-foreground/20 rotate-45" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default TechStack;
