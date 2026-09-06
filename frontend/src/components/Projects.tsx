import { useRef, useState, useEffect } from 'react';
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
        <section ref={targetRef} id="projects" className="relative h-[420vh] md:h-[450vh] bg-background text-foreground shrink-0 border-t border-foreground/5 z-20">
            {/* Horizontal Scroll Progress Bar */}
            <motion.div 
                className="sticky top-0 left-0 h-1 bg-primary z-50 origin-left"
                style={{ scaleX: scrollYProgress }} 
            />

            {/* Ambient Section Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none opacity-60" />
            
            <div className="sticky top-[4vh] sm:top-[6vh] md:top-[8vh] h-[92vh] md:h-[90vh] flex items-center overflow-hidden">
                <motion.div 
                    ref={trackRef}
                    style={{ x }} 
                    className="flex gap-6 sm:gap-8 md:gap-14 px-6 md:px-24 items-center will-change-transform"
                >
                    {/* Header Section */}
                    <div className="flex flex-col justify-center w-[85vw] sm:w-[70vw] md:w-[38vw] max-w-[480px] pr-6 md:pr-12 relative shrink-0">
                        {/* Decorative Left Line */}
                        <div className="absolute -left-6 md:-left-10 top-8 w-[2px] h-28 bg-gradient-to-b from-primary to-transparent opacity-60 hidden md:block" />
                        
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                            <span className="w-6 md:w-8 h-[1px] bg-primary/70" />
                            <span className="text-xs uppercase tracking-[0.3em] text-foreground/75 font-mono font-medium">
                                Selected Work
                            </span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl md:text-[6vw] leading-[1.08] mb-6 font-serif tracking-tight">
                            Featured <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-foreground/40 italic">
                                Projects.
                            </span>
                        </h2>
                        <p className="text-foreground/70 max-w-md leading-relaxed text-sm sm:text-base md:text-lg font-light">
                            A curated selection of enterprise platforms, full-stack systems, and architectural sandboxes.
                        </p>

                        {/* Scroll Indicator */}
                        <div className="flex items-center gap-4 text-foreground/40 mt-8 md:mt-12">
                            <div className="w-12 h-[1px] bg-foreground/20" />
                            <span className="text-xs uppercase tracking-widest font-mono">Scroll Horizontally</span>
                            <ArrowRight size={14} className="opacity-60" />
                        </div>
                    </div>

                    {/* Project Cards Horizontal Scroll */}
                    {projectsData.map((project, index) => (
                        <div
                            key={project.id}
                            className="w-[86vw] sm:w-[75vw] md:w-[50vw] lg:w-[44vw] max-w-[580px] h-[82vh] md:h-[78vh] max-h-[720px] flex flex-col justify-between p-5 sm:p-7 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-foreground/[0.02] border border-foreground/10 hover:bg-foreground/[0.035] hover:border-foreground/20 transition-all duration-500 relative overflow-hidden group shadow-2xl shadow-black/5 shrink-0"
                        >
                            {/* Giant Watermark Number */}
                            <div className="absolute bottom-4 right-6 text-[7rem] sm:text-[9rem] md:text-[11rem] font-serif font-bold text-foreground/[0.03] leading-none pointer-events-none select-none group-hover:scale-105 group-hover:text-foreground/[0.05] transition-all duration-700 origin-bottom-right">
                                0{index + 1}
                            </div>
                            
                            {/* Decorative Background Orb */}
                            <div className="absolute -top-28 -left-28 w-56 h-56 bg-primary/10 rounded-full blur-[90px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-700" />

                            {/* Inner Scroll Safe Container */}
                            <div className="flex flex-col h-full justify-between overflow-y-auto no-scrollbar z-10 relative">
                                
                                {/* Top: Header, Icon & Links */}
                                <div className="flex justify-between items-start mb-3 sm:mb-4 md:mb-5 shrink-0">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl bg-background border border-foreground/10 flex items-center justify-center shadow-lg group-hover:border-primary/50 group-hover:shadow-primary/10 transition-all duration-500">
                                            {project.icon}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-widest text-primary/80 font-mono font-medium">
                                                {project.category}
                                            </span>
                                            <span className="text-xs sm:text-sm font-medium text-foreground/80">
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
                                                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-all duration-300 flex items-center justify-center group/link bg-foreground/5 hover:bg-foreground/10 text-foreground hover:scale-110"
                                                aria-label={`View ${project.title} on GitHub`}
                                            >
                                                <Github size={18} className="group-hover/link:text-primary transition-colors" />
                                            </a>
                                        )}
                                        {project.liveLink && (
                                            <a
                                                href={project.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full transition-all duration-300 flex items-center justify-center group/link bg-foreground/5 hover:bg-foreground/10 text-foreground hover:scale-110"
                                                aria-label={`View ${project.title} Live`}
                                            >
                                                <ExternalLink size={18} className="group-hover/link:text-primary transition-colors" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Middle: Title, Description, Stack */}
                                <div className="my-auto py-1">
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight mb-2 sm:mb-3 group-hover:text-primary transition-colors duration-500">
                                        {project.title}
                                    </h3>
                                    <p className="text-foreground/75 text-xs sm:text-sm md:text-base leading-relaxed font-light line-clamp-3 sm:line-clamp-4 md:line-clamp-none mb-3 sm:mb-4 md:mb-5">
                                        {project.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-4">
                                        {project.stack.map((tech, i) => (
                                            <span key={i} className="text-[10px] sm:text-[11px] md:text-xs font-mono font-medium px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-foreground/[0.03] border border-foreground/10 text-foreground/80 backdrop-blur-md group-hover:bg-foreground/[0.06] group-hover:border-foreground/20 transition-all duration-300">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom: Key Capabilities & CTA */}
                                <div className="border-t border-foreground/10 pt-3 sm:pt-4 md:pt-5 mt-auto shrink-0">
                                    <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-foreground/50 mb-2 sm:mb-3 block font-mono font-semibold">
                                        Key Capabilities
                                    </span>
                                    
                                    {/* Capabilities List - Guaranteed Visibility across iOS & Mobiles */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 md:gap-y-2.5 mb-3 sm:mb-4">
                                        {project.features.map((feature, i) => (
                                            <div key={i} className="flex items-start gap-2 sm:gap-2.5">
                                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary/80 shrink-0 group-hover:scale-125 transition-transform" />
                                                <span className="text-[11px] sm:text-xs md:text-sm text-foreground/75 leading-snug font-light group-hover:text-foreground transition-colors line-clamp-1 sm:line-clamp-none">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action row with CTA Button */}
                                    <div className="flex items-center justify-between pt-2.5 border-t border-foreground/5">
                                        <span className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
                                            0{index + 1} / 04
                                        </span>
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-foreground hover:text-primary flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 hover:border-primary/40 transition-all group/cta"
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
                            className="relative w-full max-w-4xl max-h-[90vh] md:max-h-[86vh] flex flex-col rounded-[2rem] md:rounded-[2.5rem] bg-background/95 border border-foreground/15 shadow-[0_30px_90px_rgba(0,0,0,0.8)] overflow-hidden overscroll-contain"
                        >
                            {/* Modal Sticky Header Bar */}
                            <div className="flex items-center justify-between px-6 sm:px-8 py-4 bg-background/90 backdrop-blur-md border-b border-foreground/10 shrink-0 z-20">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-[10px] font-mono font-medium tracking-widest text-primary uppercase">
                                            Case Study • {selectedProject.year}
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono text-foreground/40 uppercase hidden sm:inline-block">
                                        {selectedProject.category}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-foreground/40 hidden sm:inline-block px-2 py-0.5 rounded border border-foreground/10">
                                        ESC
                                    </span>
                                    <button 
                                        onClick={() => setSelectedProject(null)}
                                        className="w-9 h-9 rounded-full bg-foreground/5 hover:bg-foreground/15 border border-foreground/10 flex items-center justify-center transition-all duration-300 text-foreground/70 hover:text-foreground hover:rotate-90"
                                        aria-label="Close Case Study"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Scrollable Content Area with Custom Scrollbar */}
                            <div className="flex-1 overflow-y-auto modal-scrollbar p-6 sm:p-10 md:p-12 space-y-8 sm:space-y-10 overscroll-contain">
                                
                                {/* Project Hero Emblem & Title */}
                                <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-foreground/[0.04] border border-foreground/10 flex items-center justify-center shrink-0 shadow-inner">
                                        <div className="scale-125">
                                            {selectedProject.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs font-mono uppercase tracking-[0.25em] text-primary block mb-1.5">
                                            {selectedProject.tagline}
                                        </span>
                                        <h3 className="text-3xl sm:text-5xl md:text-6xl font-serif tracking-tight text-foreground">
                                            {selectedProject.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Architecture & Spec Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                    <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/8">
                                        <div className="flex items-center gap-2 text-foreground/40 mb-1 font-mono text-[10px] uppercase tracking-wider">
                                            <Cpu size={13} />
                                            <span>Timeline</span>
                                        </div>
                                        <p className="font-serif italic text-lg sm:text-xl text-foreground">
                                            {selectedProject.year}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/8">
                                        <div className="flex items-center gap-2 text-foreground/40 mb-1 font-mono text-[10px] uppercase tracking-wider">
                                            <Layers size={13} />
                                            <span>Role</span>
                                        </div>
                                        <p className="font-serif italic text-base sm:text-lg text-foreground truncate" title={selectedProject.role}>
                                            {selectedProject.role.split('&')[0]}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/8">
                                        <div className="flex items-center gap-2 text-foreground/40 mb-1 font-mono text-[10px] uppercase tracking-wider">
                                            <Database size={13} />
                                            <span>Primary DB</span>
                                        </div>
                                        <p className="font-serif italic text-lg sm:text-xl text-foreground">
                                            {selectedProject.stack.find(s => s.includes('Postgre') || s.includes('Prisma') || s.includes('Redis')) || 'PostgreSQL'}
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/8">
                                        <div className="flex items-center gap-2 text-foreground/40 mb-1 font-mono text-[10px] uppercase tracking-wider">
                                            <Globe size={13} />
                                            <span>Deployment</span>
                                        </div>
                                        <p className="font-serif italic text-lg sm:text-xl text-foreground">
                                            {selectedProject.liveLink ? 'Live Active' : 'Open Source'}
                                        </p>
                                    </div>
                                </div>

                                {/* Deep-Dive Architecture Narrative */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-[1px] bg-primary/70" />
                                        <h4 className="text-xs font-mono uppercase tracking-widest text-foreground/60 font-semibold">
                                            System Architecture & Engineering
                                        </h4>
                                    </div>

                                    <div className="pl-4 sm:pl-5 border-l-2 border-primary/40 py-1 mb-4">
                                        <p className="text-base sm:text-lg md:text-xl font-serif italic text-foreground/90 leading-relaxed">
                                            "{selectedProject.description}"
                                        </p>
                                    </div>

                                    <p className="font-sans text-sm sm:text-base md:text-lg text-foreground/80 leading-relaxed font-light">
                                        {selectedProject.detailedDescription}
                                    </p>
                                </div>

                                {/* Key Capabilities Cards Grid */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-[1px] bg-primary/70" />
                                        <h4 className="text-xs font-mono uppercase tracking-widest text-foreground/60 font-semibold">
                                            Core Technical Feats
                                        </h4>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        {selectedProject.features.map((feature, i) => (
                                            <div 
                                                key={i} 
                                                className="p-4 sm:p-5 rounded-2xl bg-foreground/[0.025] border border-foreground/8 hover:border-primary/30 transition-colors flex items-start gap-3"
                                            >
                                                <div className="mt-0.5 p-1 rounded-full bg-primary/10 text-primary shrink-0">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <span className="text-xs sm:text-sm text-foreground/85 font-light leading-relaxed">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Technology Stack */}
                                <div className="space-y-4 border-t border-foreground/10 pt-6">
                                    <div className="flex items-center gap-3">
                                        <span className="w-6 h-[1px] bg-primary/70" />
                                        <h4 className="text-xs font-mono uppercase tracking-widest text-foreground/60 font-semibold">
                                            Technology Stack & Tooling
                                        </h4>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.stack.map((tech, i) => (
                                            <span 
                                                key={i} 
                                                className="text-xs sm:text-sm font-mono font-medium px-4 py-2 rounded-full bg-foreground/[0.04] border border-foreground/10 text-foreground/85 hover:border-primary/40 hover:bg-foreground/[0.07] transition-all"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Sticky Bottom Action Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 px-6 sm:px-8 py-4 bg-background/90 backdrop-blur-md border-t border-foreground/10 shrink-0 z-20">
                                <span className="text-xs font-mono text-foreground/40 hidden sm:inline-block">
                                    Authored by Arya Deep Singh • Noida, India
                                </span>

                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                                    {selectedProject.githubLink && (
                                        <a
                                            href={selectedProject.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full border border-foreground/20 hover:border-foreground/50 text-foreground font-mono text-xs uppercase tracking-wider hover:scale-105 transition-all flex items-center gap-2"
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
                                            className="px-6 py-2.5 sm:px-8 sm:py-3 rounded-full bg-foreground text-background font-mono text-xs uppercase tracking-wider hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-black/10"
                                        >
                                            <span>Launch Platform</span>
                                            <ExternalLink size={14} />
                                        </a>
                                    ) : (
                                        <span className="px-4 py-2 text-xs font-mono text-foreground/40 italic">
                                            Internal / Research Project
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Projects;
