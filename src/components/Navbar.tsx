import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Projects', href: '#projects' },
    { name: 'Experience', href: '#experience' },
    { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' || 
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const menuVariants: Variants = {
        closed: {
            opacity: 0,
            y: "-100%",
            transition: {
                duration: 0.5,
                ease: "easeInOut",
                when: "afterChildren",
            },
        },
        open: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeInOut",
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const linkVariants: Variants = {
        closed: { opacity: 0, y: 20 },
        open: { opacity: 1, y: 0 },
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'py-4 bg-background/80 backdrop-blur-lg border-b border-foreground/5' : 'py-8 bg-transparent'
                    }`}
            >
                <div className="container mx-auto px-6 md:px-12 flex justify-between items-center text-foreground">
                    <motion.a
                        href="#"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl font-serif italic tracking-tighter"
                    >
                        Arya.
                    </motion.a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-12">
                        {navLinks.map((link) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                className="text-sm uppercase tracking-[0.2em] font-medium opacity-60 hover:opacity-100 transition-opacity"
                                whileHover={{ y: -2 }}
                            >
                                {link.name}
                            </motion.a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 md:gap-8 z-[110]">
                        <button 
                            onClick={() => setIsDark(!isDark)}
                            className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                        {/* Hamburger (Mobile Only) */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden flex flex-col gap-2 p-2 relative"
                            aria-expanded={isOpen}
                            aria-label="Toggle navigation menu"
                            aria-controls="mobile-menu"
                        >
                            <motion.span
                                animate={isOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                                className="w-8 h-[2px] bg-foreground block rounded-full origin-center transition-colors duration-300"
                            />
                            <motion.span
                                animate={isOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                                className="w-8 h-[2px] bg-foreground block rounded-full origin-center transition-colors duration-300"
                            />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="mobile-menu"
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 z-[90] bg-background flex flex-col items-center justify-center"
                    >
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-[10%] right-[10%] w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[100px]" />
                            <div className="absolute bottom-[10%] left-[10%] w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[100px]" />
                        </div>

                        <div className="flex flex-col items-center gap-8 relative z-10">
                            {navLinks.map((link) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    variants={linkVariants}
                                    className="text-5xl md:text-7xl font-serif italic hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </div>

                        <motion.div
                            variants={linkVariants}
                            className="mt-20 flex gap-8 opacity-40"
                        >
                            <a href="#" className="uppercase tracking-[0.3em] text-xs">LinkedIn</a>
                            <a href="#" className="uppercase tracking-[0.3em] text-xs">Github</a>
                            <a href="#" className="uppercase tracking-[0.3em] text-xs">Email</a>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
