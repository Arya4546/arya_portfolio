import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface Service {
    title: string;
    description: string;
    details: string[];
}

const services: Service[] = [
    {
        title: "Software Development",
        description: "End-to-end applications built with technical precision, from scalable architectures to fluid interfaces.",
        details: ["React / Next.js", "Node.js / Express", "TypeScript", "System Design"]
    },
    {
        title: "Frontend Engineering",
        description: "High-performance interfaces with a focus on speed, aesthetics, and user-centric design.",
        details: ["Tailwind CSS", "Framer Motion", "Three.js", "Performance Ops"]
    },
    {
        title: "Backend & Cloud",
        description: "Robust API development and database management ensuring data integrity and system reliability.",
        details: ["PostgreSQL / MongoDB", "Redis", "Docker", "AWS / Vercel"]
    }
];

const Services = () => {
    return (
        <section className="bg-background px-6 md:px-20 py-32">
            <div className="max-w-7xl mx-auto">
                <div className="mb-20 md:mb-32">
                    <span className="text-xs uppercase tracking-[0.4em] text-foreground/40 mb-4 md:mb-6 block">Areas of Mastery</span>
                    <h2 className="text-5xl md:text-[8vw] leading-[1] font-serif italic">Expertise.</h2>
                </div>

                <div className="flex flex-col gap-8 md:gap-12 relative">
                    {services.map((service, index) => (
                        <ServiceCard key={index} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

interface ServiceCardProps {
    service: Service;
    index: number;
}

const ServiceCard = ({ service, index }: ServiceCardProps) => {
    const container = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ["start end", "start start"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.8 + (index * 0.05), 1]);

    return (
        <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4 md:px-0">
            <motion.div
                style={{ scale, top: `calc(-10% + ${index * 25}px)` }}
                className="w-full bg-accent/5 backdrop-blur-2xl border border-foreground/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-24 relative overflow-hidden group hover:border-primary/20 transition-colors duration-700"
            >
                <div className="absolute top-1/2 -translate-y-1/2 right-12 text-[20vw] md:text-[15vw] font-serif italic text-foreground opacity-[0.02] select-none pointer-events-none leading-none z-0 mix-blend-overlay">
                    {index + 1}
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-20 relative z-10 w-full h-full">
                    {/* Left Column: Narrative */}
                    <div className="max-w-xl lg:max-w-2xl xl:max-w-3xl flex-1">
                        <span className="text-sm font-mono text-primary/60 mb-4 md:mb-6 block italic">0{index + 1} — Expertise</span>
                        <h3 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-6 md:mb-8 leading-tight">{service.title}</h3>
                        <p className="text-lg md:text-2xl text-foreground/60 leading-relaxed italic relative">
                            <span className="absolute -left-6 md:-left-8 top-2 text-primary/20 text-3xl md:text-4xl font-serif">"</span>
                            {service.description}
                        </p>
                    </div>

                    {/* Right Column: Details/Tech */}
                    <div className="w-full md:w-auto md:min-w-[320px] lg:min-w-[400px] flex flex-col gap-6 md:gap-8 border-t md:border-t-0 md:border-l border-foreground/10 pt-8 md:pt-0 md:pl-12 lg:pl-16 relative">
                        <div>
                            <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-foreground/40 mb-6 block">Core Architecture</span>
                            <div className="flex flex-col gap-4 md:gap-6">
                                {service.details.map((detail, i) => (
                                    <div key={i} className="flex items-center group cursor-default">
                                        <div className="w-8 md:w-12 h-[1px] bg-foreground/20 mr-4 md:mr-6 group-hover:bg-primary group-hover:w-12 md:group-hover:w-16 transition-all duration-500 ease-out" />
                                        <span className="text-base md:text-lg lg:text-xl font-medium tracking-wide text-foreground/70 group-hover:text-foreground group-hover:translate-x-2 transition-all duration-500 ease-out">
                                            {detail}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Services;
