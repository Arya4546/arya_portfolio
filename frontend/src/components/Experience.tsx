import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const experiences = [
    {
        role: "Software Developer",
        company: "GoTrust",
        period: "Mar 2026 - Present",
        description: "Own end-to-end backend development for privacy-compliance modules, architecting RESTful APIs in Node.js/Express.js that cut average response time by ~30%. Designed PostgreSQL schemas and composite-index strategies for PII classification across 1M+ records, and built Keycloak-integrated RBAC/JWT authentication securing 10,000+ users aligned with DPDPA, GDPR, and ISO 27701."
    },
    {
        role: "Junior Software Developer",
        company: "AppVin Technologies",
        period: "Aug 2025 - Feb 2026",
        description: "Owned RESTful API development for enterprise ERP, logistics, and healthcare applications in Node.js/Express.js, reducing average response time by ~30%. Designed PostgreSQL/SQL schemas with indexing strategies for high-frequency ERP reporting, implemented JWT-based multi-role RBAC securing 5,000+ users, and debugged production incidents."
    },
    {
        role: "Full Stack Web Developer",
        company: "Pragyavani Solutions LLP",
        period: "Jan 2025 - Jul 2025",
        description: "Built and deployed full-stack SaaS applications (CRM, School Management System) in React.js, Node.js, Express.js, and SQL Server, owning JWT authentication and RBAC end-to-end; shipped production releases on IIS, Vercel, and Render."
    },
    {
        role: "B.Tech in Computer Science",
        company: "School of Management Sciences",
        period: "2021 - 2025",
        description: "Completed undergraduate studies with a specialization in Computer Science & Engineering. Capstone: Hospital Management System — Full-stack app with role-based access control."
    }
];

const Experience = () => {
    const [isMobile, setIsMobile] = useState(true);
    
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return (
        <section id="experience" className="bg-background py-20 md:py-32 lg:py-48 px-6 md:px-12 relative border-t border-foreground/5 z-10">
            <div className="max-w-[90rem] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32">
                
                {/* Left Column: Sticky Header */}
                <div className="lg:w-1/3 lg:sticky lg:top-40 h-fit">
                    <motion.div
                        initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-foreground/40 mb-4 md:mb-6 block font-mono">The Journey</span>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl mb-6 md:mb-8 italic leading-[1.1] font-serif tracking-tight">Milestones.</h2>
                        <p className="text-foreground/60 max-w-sm leading-relaxed text-base md:text-lg font-light">
                            A chronological record of my professional experience, enterprise contributions, and academic background.
                        </p>
                    </motion.div>
                </div>

                {/* Right Column: Experience Timeline */}
                <div className="lg:w-2/3 flex flex-col gap-16 md:gap-24 relative">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-[7.5px] md:left-[11px] top-6 bottom-0 w-[1px] bg-gradient-to-b from-foreground/10 via-foreground/10 to-transparent" />

                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: "-50px" }}
                            className="relative group pl-8 md:pl-16"
                        >
                            {/* Timeline Dot (Outer) */}
                            <div className="absolute left-0 top-1 md:top-1.5 w-[16px] h-[16px] md:w-[23px] md:h-[23px] rounded-full bg-background border-2 border-foreground/20 group-hover:border-primary transition-all duration-500 z-10" />
                            {/* Timeline Dot (Inner Glow) */}
                            <div className="absolute left-[4px] md:left-[7px] top-[5px] md:top-[7.5px] w-[8px] h-[8px] md:w-[9px] md:h-[9px] rounded-full bg-primary scale-0 group-hover:scale-100 transition-transform duration-500 z-20" />

                            <span className="inline-block px-3 py-1 mb-4 md:mb-6 text-[10px] md:text-xs font-mono text-foreground/60 border border-foreground/10 rounded-full bg-foreground/[0.02] uppercase tracking-widest">{exp.period}</span>
                            
                            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-4 md:mb-6">
                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight group-hover:text-primary transition-colors duration-500">{exp.role}</h3>
                                <span className="text-lg md:text-xl text-foreground/40 italic font-serif">@ {exp.company}</span>
                            </div>
                            
                            <p className="text-base md:text-lg text-foreground/70 leading-relaxed font-light max-w-3xl">
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
