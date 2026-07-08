import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Zap, Shield, Code, Layers, X, ArrowRight } from 'lucide-react';

const projectsData = [
    {
        id: 'codesense',
        title: 'CodeSense AI',
        year: '2026',
        description: 'Next-generation repository intelligence platform that automates code review, detects architectural bottlenecks, and provides actionable AI-driven suggestions using AST parsing and LLMs.',
        detailedDescription: 'CodeSense AI is a next-generation repository intelligence platform designed to automate code reviews and detect architectural bottlenecks. It acts as a virtual senior engineer, reviewing team code in real-time. By combining Abstract Syntax Tree (AST) parsing with Data Structures and Algorithms (DSA) complexity detection and Large Language Models (LLMs), it provides deep insights into codebases. It automatically identifies inefficient loops, duplicate logic, and potential performance regressions before they hit production environments.',
        stack: ['React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Gemini AI', 'Docker'],
        features: [
            'Deep Static Code Scanning & Complexity Detection',
            'Actionable AI Reviews via Gemini',
            'GitHub Webhook Automation',
            'Real-Time Collaboration via WebSockets'
        ],
        githubLink: 'https://github.com/Arya4546/codesense-ai',
        liveLink: '',
        icon: <Code className="text-primary" size={24} />
    },
    {
        id: 'lms',
        title: 'STEMmantra LMS',
        year: '2025',
        description: 'An enterprise-grade, Multi-Tenant Learning Management System tailored for modern STEM education. Supports robust multi-school tenancy, granular role-based access control, and a dynamic assessment engine.',
        detailedDescription: 'The STEMmantra LMS is an enterprise-grade, multi-tenant learning management system built from the ground up for modern STEM education pipelines. It features robust data isolation through isolated "Schools", allowing users to belong to multiple tenants with varying roles. The platform includes a powerful dynamic assessment engine capable of proctored, strictly-timed quizzes and independent self-paced learning. All multimedia content is heavily protected against hotlinking and unauthorized downloads via a secure, single-use token serving mechanism and HTTP 206 range-request streaming.',
        stack: ['React 18', 'Vite', 'Node.js', 'Prisma', 'PostgreSQL 16', 'B2 Storage'],
        features: [
            'Multi-Tenant School Architecture',
            'Granular Role-Based Access Control',
            'Proctored Assessment & Quiz Engine',
            'Strict Content Protection & Anti-Hotlinking'
        ],
        githubLink: 'https://github.com/Arya4546',
        liveLink: 'http://lms.tinkergyan.in/',
        icon: <Layers className="text-primary" size={24} />
    },
    {
        id: 'beautiful_encer',
        title: 'Beautiful Encer',
        year: '2025',
        description: 'A sophisticated dual-sided influencer marketing platform connecting nano and micro-influencers with salons through intelligent matchmaking, social scraping, and real-time collaboration.',
        detailedDescription: 'Beautiful Encer bridges the gap between emerging social media influencers and beauty salons. It democratizes influencer marketing by making it accessible to small and medium-sized local salons while providing nano and micro-influencers with genuine partnership opportunities. The platform securely leverages public social media data through intelligent scraping (Instagram, TikTok, YouTube) to verify engagement rates and follower growth. It features a structured connection request system, real-time WebSocket chat, and secure dual-role onboarding.',
        stack: ['React 19', 'TypeScript', 'Express', 'Prisma', 'Socket.IO', 'Apify'],
        features: [
            'Instagram & TikTok Data Scraping',
            'Advanced Discovery & Matchmaking Filters',
            'Real-Time WebSocket Chat',
            'Structured Connection Request System'
        ],
        githubLink: 'https://github.com/Arya4546/Beautiful_Encer',
        liveLink: 'https://beautiful-encer.vercel.app',
        icon: <Zap className="text-primary" size={24} />
    },
    {
        id: 'tinkergyan',
        title: 'Tinkergyan',
        year: '2024',
        description: 'Enterprise Embedded Coding Education Platform teaching kids hardware programming. Features visual drag-and-drop block coding, a C++ editor, and real-time compilation engines.',
        detailedDescription: 'Tinkergyan lowers the barrier of entry for physical computing by addressing the gap between visual blocks (Scratch-like) and real-world microcontrollers (Arduino/ESP8266). It translates visual blocks into clean, compilable C++ code in real-time. The code is then seamlessly compiled in a secure sandbox using a robust three-tier compile engine (Remote Wandbox, local Arduino CLI, or Mock). To keep young minds engaged, the platform wraps this technical execution in a highly gamified Learning Management System complete with XP, leveling systems, daily streaks, and automated achievement badges.',
        stack: ['React 18', 'Zustand', 'Framer Motion', 'Express', 'Redis', 'Arduino CLI'],
        features: [
            'Visual Block Editor to C++ Translation',
            'Three-Tier Secure Compile Engine',
            'Interactive Hardware Simulator',
            'Gamified LMS with XP and Streaks'
        ],
        githubLink: 'https://github.com/Arya4546/tinkergyan',
        liveLink: 'http://code.stemmantra.com/',
        icon: <Shield className="text-primary" size={24} />
    }
];

type ProjectType = typeof projectsData[0];

const Projects = () => {
    const targetRef = useRef<HTMLElement>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedProject) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [selectedProject]);

    return (
        <section ref={targetRef} id="projects" className="relative h-[400vh] bg-background text-foreground shrink-0 border-t border-foreground/5 z-20">
            {/* Horizontal Scroll Progress Bar */}
            <motion.div 
                className="sticky top-0 left-0 h-1 bg-primary z-50 origin-left"
                style={{ scaleX: scrollYProgress }} 
            />

            {/* Ambient Section Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none opacity-60" />
            
            <div className="sticky top-[10vh] h-[90vh] flex items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-8 md:gap-16 px-6 md:px-24 items-center">
                    
                    {/* Header Section */}
                    <div className="flex flex-col justify-center min-w-[85vw] md:min-w-[40vw] pr-8 md:pr-16 relative">
                        {/* Decorative Left Line */}
                        <div className="absolute -left-6 md:-left-12 top-10 w-[2px] h-32 bg-gradient-to-b from-primary to-transparent opacity-50 hidden md:block" />
                        
                        <span className="text-xs uppercase tracking-[0.4em] text-accent/60 mb-6 md:mb-8 block font-mono">Selected Work</span>
                        <h2 className="text-5xl md:text-[7vw] leading-[1.1] mb-8 font-serif tracking-tight">
                            Featured <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/40 italic">Projects.</span>
                        </h2>
                        <p className="text-foreground/60 max-w-md leading-relaxed md:text-lg">
                            A curated selection of enterprise platforms, full-stack applications, and architectural systems.
                        </p>

                        {/* Scroll Indicator */}
                        <div className="flex items-center gap-4 text-foreground/30 mt-12 md:mt-16">
                            <div className="w-12 h-[1px] bg-foreground/20" />
                            <span className="text-xs uppercase tracking-widest font-mono">Scroll</span>
                            <ArrowRight size={14} className="opacity-50" />
                        </div>
                    </div>

                    {/* Project Cards Horizontal Scroll */}
                    {projectsData.map((project, index) => (
                        <div
                            key={project.id}
                            className="min-w-[85vw] md:min-w-[55vw] lg:min-w-[45vw] h-[75vh] md:h-[75vh] flex flex-col justify-between p-8 md:p-12 rounded-[2.5rem] bg-foreground/[0.02] border border-foreground/10 hover:bg-foreground/[0.03] hover:border-foreground/20 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group shadow-2xl shadow-black/5"
                        >
                            {/* Giant Watermark Number - FIXED VISIBILITY */}
                            <div className="absolute bottom-6 right-8 text-[8rem] md:text-[12rem] font-serif font-bold text-foreground/[0.04] leading-none pointer-events-none select-none group-hover:scale-105 group-hover:text-foreground/[0.06] transition-all duration-700 origin-bottom-right">
                                0{index + 1}
                            </div>
                            
                            {/* Decorative Background Orb */}
                            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />

                            <div className="flex flex-col h-full z-10 relative">
                                {/* Top: Header & Link */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-background border border-foreground/10 flex items-center justify-center shadow-lg group-hover:border-primary/50 group-hover:shadow-primary/10 transition-all duration-500">
                                            {project.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-widest text-foreground/50 font-mono">
                                                Project
                                            </span>
                                            <span className="text-sm font-medium text-foreground/80">
                                                {project.year}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {project.githubLink && (
                                            <a
                                                href={project.githubLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group/link bg-foreground/5 hover:bg-foreground/10 text-foreground hover:scale-110"
                                                aria-label={`View ${project.title} on GitHub`}
                                            >
                                                <Github size={20} className="group-hover/link:text-primary transition-colors" />
                                            </a>
                                        )}
                                        {project.liveLink && (
                                            <a
                                                href={project.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center group/link bg-foreground/5 hover:bg-foreground/10 text-foreground hover:scale-110"
                                                aria-label={`View ${project.title} Live`}
                                            >
                                                <ExternalLink size={20} className="group-hover/link:text-primary transition-colors" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Middle: Title, Description, Stack */}
                                <div className="mb-auto">
                                    <h3 className="text-4xl md:text-5xl font-serif tracking-tight mb-5 group-hover:text-primary transition-colors duration-500">
                                        {project.title}
                                    </h3>
                                    <p className="text-foreground/70 text-base md:text-lg leading-relaxed font-light max-w-2xl mb-8">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {project.stack.map((tech, i) => (
                                            <span key={i} className="text-[11px] md:text-xs font-medium px-4 py-1.5 rounded-full bg-foreground/[0.03] border border-foreground/10 text-foreground/80 backdrop-blur-md group-hover:bg-foreground/[0.06] group-hover:border-foreground/20 transition-all duration-300">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom: Features Grid & CTA */}
                                <div className="border-t border-foreground/10 pt-6 mt-4 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                    <div className="flex-1">
                                        <span className="text-[10px] uppercase tracking-widest text-foreground/40 mb-5 block font-mono">Key Capabilities</span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                            {project.features.map((feature, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0 group-hover:scale-150 transition-transform duration-500" />
                                                    <span className="text-sm text-foreground/70 leading-relaxed font-light group-hover:text-foreground/90 transition-colors">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedProject(project)}
                                        className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 hover:text-primary flex items-center gap-2 group/cta transition-colors shrink-0"
                                    >
                                        Read Case Study <ArrowRight size={14} className="group-hover/cta:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Detailed Case Study Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-xl"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-background border border-foreground/10 shadow-2xl shadow-black/20 p-8 md:p-12"
                        >
                            <button 
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-6 right-6 p-3 rounded-full bg-foreground/5 hover:bg-foreground/10 transition-colors text-foreground/70 hover:text-foreground"
                            >
                                <X size={24} />
                            </button>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                    {selectedProject.icon}
                                </div>
                                <div>
                                    <span className="text-xs font-mono text-primary uppercase tracking-widest block mb-1">
                                        Case Study — {selectedProject.year}
                                    </span>
                                    <h3 className="text-3xl md:text-5xl font-serif tracking-tight">
                                        {selectedProject.title}
                                    </h3>
                                </div>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                                <p className="text-foreground/80 leading-relaxed font-light text-lg md:text-xl">
                                    {selectedProject.detailedDescription}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-foreground/10 pt-8">
                                <div>
                                    <h4 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-6">Technologies Used</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.stack.map((tech, i) => (
                                            <span key={i} className="text-xs font-medium px-4 py-2 rounded-full bg-foreground/5 border border-foreground/10 text-foreground/80">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-mono uppercase tracking-widest text-foreground/50 mb-6">Key Capabilities</h4>
                                    <ul className="space-y-4">
                                        {selectedProject.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                <span className="text-foreground/80 font-light">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-foreground/10 flex flex-wrap justify-end gap-4">
                                {selectedProject.githubLink && (
                                    <a
                                        href={selectedProject.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-4 rounded-full border border-foreground/20 hover:border-foreground/40 text-foreground font-medium hover:scale-105 transition-all flex items-center gap-3"
                                    >
                                        <Github size={20} />
                                        Source Code
                                    </a>
                                )}
                                {selectedProject.liveLink && (
                                    <a
                                        href={selectedProject.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-4 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform flex items-center gap-3"
                                    >
                                        View Live
                                        <ExternalLink size={16} className="opacity-50" />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Projects;
