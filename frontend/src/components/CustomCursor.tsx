import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const CustomCursor = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Tighter, more responsive physics
    const cursorX = useSpring(-100, { stiffness: 800, damping: 28, mass: 0.2 });
    const cursorY = useSpring(-100, { stiffness: 800, damping: 28, mass: 0.2 });
    
    // Snappy center dot
    const cursorXDot = useSpring(-100, { stiffness: 1200, damping: 40, mass: 0.1 });
    const cursorYDot = useSpring(-100, { stiffness: 1200, damping: 40, mass: 0.1 });

    useEffect(() => {
        const updateCursorPosition = (e: MouseEvent) => {
            if (!isVisible) setIsVisible(true);
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
            
            cursorXDot.set(e.clientX - 4);
            cursorYDot.set(e.clientY - 4);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('[role="button"]')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseLeave = () => setIsVisible(false);
        const handleMouseEnter = () => setIsVisible(true);

        window.addEventListener('mousemove', updateCursorPosition);
        window.addEventListener('mouseover', handleMouseOver);
        document.documentElement.addEventListener('mouseleave', handleMouseLeave);
        document.documentElement.addEventListener('mouseenter', handleMouseEnter);

        document.body.classList.add('custom-cursor-active');

        setMounted(true);

        return () => {
            window.removeEventListener('mousemove', updateCursorPosition);
            window.removeEventListener('mouseover', handleMouseOver);
            document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
            document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
            document.body.classList.remove('custom-cursor-active');
        };
    }, []);

    if (!mounted || (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)) {
        // Disable on touch devices
        return null;
    }

    return (
        <div className="hidden md:block pointer-events-none z-[99999]">
            {/* Main Ring - Mix blend difference with white creates perfect inversion on *any* background */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white mix-blend-difference pointer-events-none flex items-center justify-center bg-transparent z-[99999]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? 'white' : 'transparent',
                    borderColor: isHovering ? 'transparent' : 'white'
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            />
            {/* Inner Dot */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 rounded-full bg-white mix-blend-difference pointer-events-none z-[99999]"
                style={{
                    x: cursorXDot,
                    y: cursorYDot,
                    opacity: isVisible ? 1 : 0,
                }}
                animate={{
                    scale: isHovering ? 0 : 1,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
            />
        </div>
    );
};

export default CustomCursor;
