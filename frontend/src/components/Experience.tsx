import { motion } from 'framer-motion';

const experiences = [
    {
        role: "Full Stack Intern",
        company: "Freelance",
        period: "2024 - Present",
        description: "Developing scalable web solutions and interactive frontend experiences for diverse clients."
    },
    {
        role: "Frontend Developer",
        company: "Open Source",
        period: "2023 - 2024",
        description: "Contributing to various React ecosystems and component libraries with a focus on UX."
    },
    {
        role: "B.Tech Graduation",
        company: "Engineering",
        period: "May 2025",
        description: "Completing undergraduate studies with a specialization in Computer Science & Engineering."
    }
];

const Experience = () => {
    return (
        <section className="bg-background py-40 px-6 md:px-20 relative">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    <span className="text-xs uppercase tracking-[0.4em] text-foreground/40 mb-4 block">The Journey</span>
                    <h2 className="text-5xl md:text-[8vw] mb-20 md:mb-32 italic leading-none">Milestones.</h2>
                </motion.div>

                <div className="space-y-24 md:space-y-40">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: 0.1 }}
                            viewport={{ once: false, margin: "-100px" }}
                            className="relative pl-8 md:pl-20 border-l border-foreground/10 group"
                        >
                            <div className="absolute top-0 left-[-5px] w-[10px] h-[10px] rounded-full bg-primary scale-0 group-hover:scale-150 transition-transform duration-500" />
                            <span className="text-xs md:text-sm font-mono text-foreground/40 mb-4 md:mb-6 block uppercase tracking-widest">{exp.period}</span>
                            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4 md:mb-8">
                                <h3 className="text-3xl md:text-6xl font-serif group-hover:text-primary transition-colors duration-500">{exp.role}</h3>
                                <span className="text-lg md:text-2xl italic text-foreground/40">{exp.company}</span>
                            </div>
                            <p className="text-base md:text-2xl text-foreground/60 max-w-2xl leading-relaxed italic">
                                {exp.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
