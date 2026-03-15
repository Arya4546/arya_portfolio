import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ExternalLink, Github } from 'lucide-react';
import portfolioImg from '../assets/portfolio.jpeg';

interface Project {
    title: string;
    description: string;
    stack: string[];
    image: string;
}

const projects: Project[] = [
    {
        title: "CRM System",
        description: "Enterprise-grade customer relationship management platform with real-time analytics.",
        stack: ["React", "Express", "PostgreSQL"],
        image: portfolioImg
    },
    {
        title: "School Mgmt",
        description: "Holistic educational platform managing student lifecycles and communications.",
        stack: ["Next.js", "Prisma", "TypeScript"],
        image: portfolioImg
    },
    {
        title: "Visitor Mgmt",
        description: "Secure and efficient entry tracking with QR integration and instant notifications.",
        stack: ["React Native", "Firebase", "Node"],
        image: portfolioImg
    },
    {
        title: "Cancer Hospital",
        description: "Critical care management system designed for oncology treatment tracking.",
        stack: ["React", "Python", "MongoDB"],
        image: portfolioImg
    },
    {
        title: "DevHub",
        description: "A collaborative ecosystem for developers to share resources and showcase patterns.",
        stack: ["Vite", "Tailwind", "Framer"],
        image: portfolioImg
    }
];

const Projects = () => {
    const targetRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);

    return (
        <section ref={targetRef} className="relative h-[500vh] bg-foreground text-background">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-8 md:gap-12 px-6 md:px-24">
                    <div className="flex flex-col justify-center min-w-[70vw] md:min-w-[50vw]">
                        <span className="text-xs uppercase tracking-[0.4em] text-accent/60 mb-6 md:mb-8 block">Selected Work</span>
                        <h2 className="text-5xl md:text-[8vw] leading-tight mb-8">Visionary <br /> Ventures.</h2>
                    </div>
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            className="min-w-[85vw] md:min-w-[45vw] h-[60vh] md:h-[75vh] group relative rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-black border border-foreground/5 cursor-pointer"
                        >
                            <div className="absolute inset-0 bg-black overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover opacity-70 grayscale-[0.8] group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                                />
                            </div>

                            {/* Subtle overlay to ensure text is always readable over images */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            {/* View Badge */}
                            <div className="absolute top-12 right-12 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
                                <div className="w-24 h-24 rounded-full border border-primary/30 flex items-center justify-center backdrop-blur-md bg-black/20 animate-pulse">
                                    <span className="text-[10px] uppercase tracking-widest text-primary font-bold">View Case</span>
                                </div>
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 translate-y-[20%] group-hover:translate-y-0 transition-transform duration-[800ms] ease-out z-10">
                                <div className="flex justify-between items-start mb-4 md:mb-6">
                                    <div>
                                        <span className="text-[10px] font-mono mb-1 md:mb-2 block opacity-60 italic">0{index + 1} — Archive</span>
                                        <h4 className="text-3xl md:text-5xl font-serif">{project.title}</h4>
                                    </div>
                                    <div className="flex gap-3 md:gap-4">
                                        <a href="#" className="p-2 md:p-3 bg-primary text-primary-foreground rounded-full hover:scale-110 transition-transform">
                                            <Github size={18} />
                                        </a>
                                        <a href="#" className="p-2 md:p-3 bg-foreground text-background rounded-full hover:scale-110 transition-transform">
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>
                                </div>
                                <p className="text-base md:text-lg text-foreground/70 italic mb-4 md:mb-6 max-w-sm">{project.description}</p>
                                <div className="flex flex-wrap gap-3 md:gap-4">
                                    {project.stack.map((tech, i) => (
                                        <span key={i} className="text-[9px] md:text-[10px] tracking-widest uppercase border-b border-primary/40 pb-1">{tech}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
