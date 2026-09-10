import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Github, ExternalLink, Zap, Shield, Code, Layers, X, ArrowRight, CheckCircle2, Cpu, Database, Globe } from 'lucide-react';

interface ProjectType {
    id: string;
    title: string;
    year: string;
    category: string;
    role: string;
    architecture: string;
    tagline: string;
    description: string;
    detailedDescription: string;
    stack: string[];
    features: string[];
    githubLink: string;
    liveLink: string;
    icon: React.ReactNode;
}

const projectsData: ProjectType[] = [
    {
        id: 'codesense',
        title: 'CodeSense AI',
        year: '2026',
        category: 'AI & Developer Tooling',
        role: 'Full-Stack Architect & AI Engineer',
        architecture: 'AST Parser + LLM Engine + WebSockets',
        tagline: 'Autonomous repository intelligence & architectural bottleneck detection',
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
        year: '2026',
        category: 'Enterprise EdTech Platform',
        role: 'Backend Architect & Security Lead',
        architecture: 'Multi-Tenant Isolation + Range Streaming',
        tagline: 'Multi-tenant school architecture with dynamic assessment engines',
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
        category: 'Marketplace & Analytics',
        role: 'Full-Stack Developer',
        architecture: 'Dual-Role Flow + WebSockets + Data Scraping',
        tagline: 'Dual-sided creator economy connecting nano-influencers with local salons',
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
        year: '2026',
        category: 'Embedded Systems & Gamification',
        role: 'Full-Stack & Sandbox Architect',
        architecture: 'Three-Tier Sandbox + AST Code Generator',
        tagline: 'Visual block coding compiler for physical computing microcontrollers',
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

const Projects = () => {
    const targetRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
    const [scrollRange, setScrollRange] = useState(0);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"]
    });

    // Measure total scrollable distance accurately across all screen sizes
    useEffect(() => {
        const updateScrollRange = () => {
            if (!trackRef.current) return;
            const viewportWidth = window.innerWidth;
            const lastCard = trackRef.current.children[trackRef.current.children.length - 1] as HTMLElement;
            
            if (lastCard) {
                const cardLeft = lastCard.offsetLeft;
                const cardWidth = lastCard.offsetWidth;
                // Center the last card cleanly within the viewport
                const targetLeft = Math.max(16, (viewportWidth - cardWidth) / 2);
                const maxDistance = Math.max(0, cardLeft - targetLeft);
                setScrollRange(maxDistance);
            } else {
                const trackWidth = trackRef.current.scrollWidth;
                setScrollRange(Math.max(0, trackWidth - viewportWidth + 60));
            }
        };

        updateScrollRange();
        const timer = setTimeout(updateScrollRange, 350);
        window.addEventListener('resize', updateScrollRange);

        const observer = new ResizeObserver(() => updateScrollRange());
        if (trackRef.current) observer.observe(trackRef.current);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updateScrollRange);
            observer.disconnect();
        };
    }, []);

    // Reach the last card by ~0.88, holding steady till 1.0 so user can view/interact with all cards
    const x = useTransform(
        scrollYProgress,
        [0, 0.88, 1],
        [0, -scrollRange, -scrollRange]
    );

    // Robust scroll locking for modal (including Lenis, body, and HTML)
    useEffect(() => {
        if (selectedProject) {
            (window as any).__lenis?.stop();
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            (window as any).__lenis?.start();
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.touchAction = '';
        }

        return () => {
            (window as any).__lenis?.start();
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [selectedProject]);

    // Keyboard ESC listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedProject(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <section ref={targetRef} id="projects" className="relative bg-background text-foreground shrink-0 border-t border-foreground/5 z-20
            h-auto md:h-[450vh]">
            {/* Horizontal Scroll Progress Bar — desktop only */}
            <motion.div 
                className="hidden md:block sticky top-0 left-0 h-1 bg-primary z-50 origin-left"
                style={{ scaleX: scrollYProgress }} 
            />

            {/* Ambient Section Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none opacity-60" />

            {/* ── MOBILE LAYOUT: vertical stacked cards ── */}
            <div className="md:hidden flex flex-col px-4 pt-16 pb-12 gap-6">
                {/* Mobile Section Header */}
                <div className="flex flex-col mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-6 h-[1px] bg-primary/70" />
                        <span className="text-xs uppercase tracking-[0.3em] text-foreground/75 font-mono font-medium">Selected Work</span>
                    </div>
                    <h2 className="text-4xl leading-[1.08] mb-3 font-serif tracking-tight">
                        Featured <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-foreground/40 italic">Projects.</span>
                    </h2>
                    <p className="text-foreground/70 leading-relaxed text-sm font-light">
                        A curated selection of enterprise platforms, full-stack systems, and architectural sandboxes.
                    </p>
                </div>

                {/* Mobile Project Cards — vertical, full-width, auto height */}
                {projectsData.map((project, index) => (
                    <div
                        key={project.id}
                        className="w-full flex flex-col p-5 rounded-[1.75rem] bg-foreground/[0.02] border border-foreground/10 relative overflow-hidden shadow-xl shadow-black/5"
                    >
                        {/* Decorative Background Orb */}
                        <div className="absolute -top-20 -left-20 w-44 h-44 bg-primary/10 rounded-full blur-[70px] pointer-events-none" />

                        {/* Header: Icon + Category + Links */}
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-background border border-foreground/10 flex items-center justify-center shadow-lg">
                                    {project.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-primary/80 font-mono font-medium leading-tight">{project.category}</span>
                                    <span className="text-xs font-medium text-foreground/80">{project.year}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {project.githubLink && (
                                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full flex items-center justify-center bg-foreground/5 border border-foreground/10 text-foreground/70"
                                        aria-label={`View ${project.title} on GitHub`}>
                                        <Github size={16} />
                                    </a>
                                )}
                                {project.liveLink && (
                                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full flex items-center justify-center bg-foreground/5 border border-foreground/10 text-foreground/70"
                                        aria-label={`View ${project.title} Live`}>
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Title & Description */}
                        <div className="relative z-10 mb-4">
                            <h3 className="text-2xl font-serif tracking-tight mb-2">{project.title}</h3>
                            <p className="text-foreground/70 text-sm leading-relaxed font-light line-clamp-3">{project.description}</p>
                        </div>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
                            {project.stack.map((tech, i) => (
                                <span key={i} className="text-[10px] font-mono font-medium px-2.5 py-1 rounded-full bg-foreground/[0.03] border border-foreground/10 text-foreground/80">
                                    {tech}
                                </span>
                            ))}
                        </div>

                        {/* Key Capabilities */}
                        <div className="border-t border-foreground/10 pt-4 relative z-10">
                            <span className="text-[9px] uppercase tracking-widest text-foreground/50 mb-2.5 block font-mono font-semibold">Key Capabilities</span>
                            <div className="flex flex-col gap-1.5 mb-4">
                                {project.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0" />
                                        <span className="text-xs text-foreground/70 leading-snug font-light">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA row */}
                            <div className="flex items-center justify-between pt-3 border-t border-foreground/5">
                                <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">0{index + 1} / 04</span>
                                <button
                                    onClick={() => setSelectedProject(project)}
                                    className="text-[10px] font-mono uppercase tracking-widest text-foreground flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-foreground/5 border border-foreground/10 active:scale-95 transition-transform"
                                >
                                    <span>Case Study</span>
                                    <ArrowRight size={12} className="text-primary" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── DESKTOP LAYOUT: horizontal scroll (unchanged) ── */}
            <div className="hidden md:flex sticky top-[8vh] h-[90vh] items-center overflow-hidden">
                <motion.div 
                    ref={trackRef}
                    style={{ x }} 
                    className="flex gap-14 px-24 items-center will-change-transform"
                >
                    {/* Header Section */}
                    <div className="flex flex-col justify-center w-[38vw] max-w-[480px] pr-12 relative shrink-0">
                        <div className="absolute -left-10 top-8 w-[2px] h-28 bg-gradient-to-b from-primary to-transparent opacity-60" />
                        
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-[1px] bg-primary/70" />
                            <span className="text-xs uppercase tracking-[0.3em] text-foreground/75 font-mono font-medium">Selected Work</span>
                        </div>

                        <h2 className="text-[6vw] leading-[1.08] mb-6 font-serif tracking-tight">
                            Featured <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-foreground/40 italic">Projects.</span>
                        </h2>
                        <p className="text-foreground/70 max-w-md leading-relaxed text-lg font-light">
                            A curated selection of enterprise platforms, full-stack systems, and architectural sandboxes.
                        </p>

                        <div className="flex items-center gap-4 text-foreground/40 mt-12">
                            <div className="w-12 h-[1px] bg-foreground/20" />
                            <span className="text-xs uppercase tracking-widest font-mono">Scroll Horizontally</span>
                            <ArrowRight size={14} className="opacity-60" />
                        </div>
                    </div>

                    {/* Desktop Project Cards */}
                    {projectsData.map((project, index) => (
                        <div
                            key={project.id}
                            className="w-[50vw] lg:w-[44vw] max-w-[580px] h-[78vh] max-h-[720px] flex flex-col justify-between p-10 rounded-[2.5rem] bg-foreground/[0.02] border border-foreground/10 hover:bg-foreground/[0.035] hover:border-foreground/20 transition-all duration-500 relative overflow-hidden group shadow-2xl shadow-black/5 shrink-0"
                        >
                            {/* Giant Watermark Number */}
                            <div className="absolute bottom-4 right-6 text-[11rem] font-serif font-bold text-foreground/[0.03] leading-none pointer-events-none select-none group-hover:scale-105 group-hover:text-foreground/[0.05] transition-all duration-700 origin-bottom-right">
                                0{index + 1}
                            </div>
                            
                            {/* Decorative Background Orb */}
                            <div className="absolute -top-28 -left-28 w-56 h-56 bg-primary/10 rounded-full blur-[90px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />

                            <div className="flex flex-col h-full justify-between overflow-y-auto no-scrollbar z-10 relative">
                                {/* Top: Header, Icon & Links */}
                                <div className="flex justify-between items-start mb-5 shrink-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-background border border-foreground/10 flex items-center justify-center shadow-lg group-hover:border-primary/50 group-hover:shadow-primary/10 transition-all duration-500">
                                            {project.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-widest text-primary/80 font-mono font-medium">{project.category}</span>
                                            <span className="text-sm font-medium text-foreground/80">{project.year}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        {project.githubLink && (
                                            <a href={project.githubLink} target="_blank" rel="noopener noreferrer"
                                                className="w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center group/link bg-foreground/5 hover:bg-foreground/10 text-foreground hover:scale-110"
                                                aria-label={`View ${project.title} on GitHub`}>
                                                <Github size={18} className="group-hover/link:text-primary transition-colors" />
                                            </a>
                                        )}
                                        {project.liveLink && (
                                            <a href={project.liveLink} target="_blank" rel="noopener noreferrer"
                                                className="w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center group/link bg-foreground/5 hover:bg-foreground/10 text-foreground hover:scale-110"
                                                aria-label={`View ${project.title} Live`}>
                                                <ExternalLink size={18} className="group-hover/link:text-primary transition-colors" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Middle: Title, Description, Stack */}
                                <div className="my-auto py-1">
                                    <h3 className="text-4xl lg:text-5xl font-serif tracking-tight mb-3 group-hover:text-primary transition-colors duration-500">
                                        {project.title}
                                    </h3>
                                    <p className="text-foreground/75 text-base leading-relaxed font-light mb-5">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.stack.map((tech, i) => (
                                            <span key={i} className="text-xs font-mono font-medium px-3 py-1 rounded-full bg-foreground/[0.03] border border-foreground/10 text-foreground/80 backdrop-blur-md group-hover:bg-foreground/[0.06] group-hover:border-foreground/20 transition-all duration-300">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom: Key Capabilities & CTA */}
                                <div className="border-t border-foreground/10 pt-5 mt-auto shrink-0">
                                    <span className="text-[10px] uppercase tracking-widest text-foreground/50 mb-3 block font-mono font-semibold">Key Capabilities</span>
                                    
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4">
                                        {project.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2.5">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0 group-hover:scale-125 transition-transform" />
                                                <span className="text-sm text-foreground/75 leading-snug font-light group-hover:text-foreground transition-colors">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between pt-2.5 border-t border-foreground/5">
                                        <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">0{index + 1} / 04</span>
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="text-xs font-mono uppercase tracking-widest text-foreground hover:text-primary flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 hover:border-primary/40 transition-all group/cta"
                                        >
                                            <span>Read Case Study</span>
                                            <ArrowRight size={13} className="group-hover/cta:translate-x-1 transition-transform text-primary" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Bespoke Architectural Case Study Modal */}
            {createPortal(
                <AnimatePresence>
                    {selectedProject && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            data-lenis-prevent="true"
                            onWheel={(e) => e.stopPropagation()}
                            onTouchMove={(e) => e.stopPropagation()}
                            className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/85 backdrop-blur-2xl overscroll-contain"
                            onClick={() => setSelectedProject(null)}
                        >
                            <motion.div
                                role="dialog"
                                aria-modal="true"
                                aria-label={`Case study for ${selectedProject.title}`}
                                initial={{ opacity: 0, scale: 0.96, y: 25 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.96, y: 15 }}
                                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                onClick={(e) => e.stopPropagation()}
                                data-lenis-prevent="true"
                                className="relative w-full h-[95vh] md:h-auto md:max-h-[85vh] max-w-5xl flex flex-col bg-background/95 backdrop-blur-3xl border-t md:border border-foreground/10 md:rounded-[2rem] rounded-t-[2rem] rounded-b-none mt-auto md:mt-0 shadow-[0_-20px_80px_rgba(0,0,0,0.2)] md:shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden overscroll-contain origin-bottom md:origin-center"
                            >
                                {/* Mobile Drag Handle Indicator */}
                                <div className="w-full flex justify-center pt-3 pb-1 md:hidden bg-background/50 absolute top-0 z-30">
                                    <div className="w-12 h-1.5 bg-foreground/20 rounded-full" />
                                </div>

                                {/* Modal Sticky Header Bar */}
                                <div className="flex items-center justify-between px-5 sm:px-10 py-5 md:py-6 bg-background/80 backdrop-blur-xl border-b border-foreground/5 shrink-0 z-20 pt-10 md:pt-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-inner">
                                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                            <span className="text-[10px] md:text-xs font-mono font-bold tracking-widest text-primary uppercase mt-0.5">
                                                Case Study
                                            </span>
                                        </div>
                                        <span className="text-[10px] md:text-xs font-mono text-foreground/40 uppercase hidden sm:inline-block tracking-widest border-l border-foreground/10 pl-4">
                                            {selectedProject.category}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-mono text-foreground/40 hidden sm:inline-block px-2 py-1 rounded border border-foreground/10 uppercase tracking-widest">
                                            ESC
                                        </span>
                                        <button 
                                            onClick={() => setSelectedProject(null)}
                                            className="w-10 h-10 rounded-full bg-foreground/[0.03] hover:bg-foreground/10 border border-foreground/10 flex items-center justify-center transition-all duration-300 text-foreground/60 hover:text-foreground hover:rotate-90 hover:scale-105"
                                            aria-label="Close Case Study"
                                        >
                                            <X size={20} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                </div>

                                {/* Modal Scrollable Content Area */}
                                <div className="flex-1 overflow-y-auto modal-scrollbar relative bg-gradient-to-b from-background via-background to-foreground/[0.02]">
                                    {/* Subtle Background Pattern/Gradient */}
                                    <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                                    
                                    <div className="p-6 sm:p-10 md:p-14 space-y-12 sm:space-y-16 max-w-4xl mx-auto relative z-10">
                                        {/* Project Hero Emblem & Title */}
                                        <div className="flex flex-col gap-6 md:gap-8">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] bg-gradient-to-br from-foreground/[0.08] to-foreground/[0.02] border border-foreground/10 flex items-center justify-center shrink-0 shadow-lg shadow-black/5">
                                                <div className="scale-[1.5] sm:scale-[1.8] text-foreground/80">
                                                    {selectedProject.icon}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-primary block mb-4 font-semibold">
                                                    {selectedProject.tagline}
                                                </span>
                                                <h3 className="text-4xl sm:text-5xl md:text-7xl font-serif tracking-tight text-foreground leading-[1.1]">
                                                    {selectedProject.title}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Architecture & Spec Grid (Premium Cards) */}
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                            {[
                                                { label: 'Timeline', icon: <Cpu size={14} />, value: selectedProject.year },
                                                { label: 'Role', icon: <Layers size={14} />, value: selectedProject.role.split('&')[0] },
                                                { label: 'Primary DB', icon: <Database size={14} />, value: selectedProject.stack.find(s => s.includes('Postgre') || s.includes('Prisma') || s.includes('Redis')) || 'PostgreSQL' },
                                                { label: 'Deployment', icon: <Globe size={14} />, value: selectedProject.liveLink ? 'Live Active' : 'Open Source' }
                                            ].map((stat, idx) => (
                                                <div key={idx} className="p-5 sm:p-6 rounded-[1.5rem] bg-foreground/[0.02] border border-foreground/5 hover:bg-foreground/[0.04] transition-colors group">
                                                    <div className="flex items-center gap-2.5 text-foreground/40 mb-3 font-mono text-[10px] md:text-xs uppercase tracking-widest group-hover:text-primary/70 transition-colors">
                                                        {stat.icon}
                                                        <span>{stat.label}</span>
                                                    </div>
                                                    <p className="font-serif italic text-xl sm:text-2xl text-foreground/90">
                                                        {stat.value}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Deep-Dive Architecture Narrative */}
                                        <div className="space-y-6 md:space-y-8">
                                            <div className="flex items-center gap-4">
                                                <span className="w-12 h-[1px] bg-primary/40" />
                                                <h4 className="text-sm md:text-base font-mono uppercase tracking-[0.2em] text-foreground/50">
                                                    System Architecture
                                                </h4>
                                            </div>

                                            <div className="pl-6 md:pl-8 border-l-2 border-primary/30 py-2">
                                                <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-foreground leading-snug">
                                                    "{selectedProject.description}"
                                                </p>
                                            </div>

                                            <p className="font-sans text-base sm:text-lg md:text-xl text-foreground/70 leading-relaxed font-light max-w-3xl">
                                                {selectedProject.detailedDescription}
                                            </p>
                                        </div>

                                        {/* Key Capabilities Cards Grid */}
                                        <div className="space-y-6 md:space-y-8">
                                            <div className="flex items-center gap-4">
                                                <span className="w-12 h-[1px] bg-primary/40" />
                                                <h4 className="text-sm md:text-base font-mono uppercase tracking-[0.2em] text-foreground/50">
                                                    Core Technical Feats
                                                </h4>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                                {selectedProject.features.map((feature, i) => (
                                                    <div 
                                                        key={i} 
                                                        className="p-5 sm:p-6 rounded-[1.5rem] bg-foreground/[0.015] border border-foreground/5 hover:border-primary/20 hover:bg-foreground/[0.03] transition-all duration-300 flex items-start gap-4 group shadow-sm"
                                                    >
                                                        <div className="mt-1 p-1.5 rounded-full bg-primary/10 text-primary shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-background transition-all">
                                                            <CheckCircle2 size={16} strokeWidth={2.5} />
                                                        </div>
                                                        <span className="text-sm md:text-base text-foreground/80 font-light leading-relaxed">
                                                            {feature}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Technology Stack */}
                                        <div className="space-y-6 md:space-y-8 border-t border-foreground/10 pt-10 md:pt-12 pb-8">
                                            <div className="flex items-center gap-4">
                                                <span className="w-12 h-[1px] bg-primary/40" />
                                                <h4 className="text-sm md:text-base font-mono uppercase tracking-[0.2em] text-foreground/50">
                                                    Technology Stack
                                                </h4>
                                            </div>

                                            <div className="flex flex-wrap gap-3">
                                                {selectedProject.stack.map((tech, i) => (
                                                    <span 
                                                        key={i} 
                                                        className="text-xs sm:text-sm font-mono tracking-wide px-5 py-2.5 rounded-full bg-foreground/[0.03] border border-foreground/10 text-foreground/80 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all cursor-default"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Sticky Bottom Action Bar */}
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 sm:px-10 py-5 bg-background/80 backdrop-blur-xl border-t border-foreground/5 shrink-0 z-20">
                                    <span className="text-[10px] md:text-xs font-mono text-foreground/40 hidden md:inline-block tracking-widest uppercase">
                                        Developed by Arya Deep Singh
                                    </span>

                                    <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
                                        {selectedProject.githubLink && (
                                            <a
                                                href={selectedProject.githubLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 md:py-3.5 rounded-full border border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5 text-foreground font-mono text-xs uppercase tracking-widest transition-all flex items-center gap-3 w-full md:w-auto justify-center"
                                            >
                                                <Github size={16} />
                                                <span>Repository</span>
                                            </a>
                                        )}
                                        {selectedProject.liveLink ? (
                                            <a
                                                href={selectedProject.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-8 py-3 md:py-3.5 rounded-full bg-foreground hover:bg-primary text-background hover:text-primary-foreground font-mono text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl hover:shadow-primary/20 w-full md:w-auto justify-center group"
                                            >
                                                <span>Launch App</span>
                                                <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </a>
                                        ) : (
                                            <span className="px-6 py-3 md:py-3.5 text-[10px] md:text-xs font-mono text-foreground/40 uppercase tracking-widest border border-foreground/10 rounded-full w-full md:w-auto text-center">
                                                Internal Project
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
};

export default Projects;
