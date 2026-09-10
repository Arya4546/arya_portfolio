import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ParticleText from './ParticleText';

// Reads the site's monochrome theme tokens directly from CSS custom properties
// so the particle palette flips correctly with the light/dark toggle in
// Navbar.tsx (which just adds/removes .dark on <html>) without duplicating
// the color values here.
const readThemeColors = (): string[] => {
    if (typeof window === 'undefined') return ['#151515', '#ededed', '#151515'];
    const styles = getComputedStyle(document.documentElement);
    const foreground = styles.getPropertyValue('--color-foreground').trim() || '#151515';
    const accent = styles.getPropertyValue('--color-accent').trim() || foreground;
    return [foreground, accent, foreground];
};

const useThemeColors = () => {
    const [colors, setColors] = useState<string[]>(readThemeColors);

    useEffect(() => {
        const update = () => setColors(readThemeColors());
        update();

        const observer = new MutationObserver(update);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return colors;
};

// Detect touch devices (iPhones, Android) — they get the Framer Motion fallback
// instead of the canvas particle animation to prevent iOS GPU memory crashes.
const useIsTouchDevice = (): boolean => {
    const [isTouch, setIsTouch] = useState(false);
    useEffect(() => {
        setIsTouch(window.matchMedia('(pointer: coarse)').matches);
    }, []);
    return isTouch;
};

// Premium character-by-character reveal for mobile — matches the cinematic
// feel of the particle animation without the heavy canvas computation.
const MobileNameReveal = () => {
    const line1 = 'Arya';
    const line2 = 'Deep Singh';

    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.04, delayChildren: 0.2 },
        },
    };

    const charVariants = {
        hidden: { opacity: 0, y: '0.3em', filter: 'blur(8px)' },
        visible: {
            opacity: 1,
            y: '0em',
            filter: 'blur(0px)',
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
        },
    };

    const renderLine = (text: string) =>
        text.split('').map((char, i) => (
            <motion.span
                key={i}
                variants={charVariants}
                style={{ display: 'inline-block', whiteSpace: char === ' ' ? 'pre' : 'normal' }}
            >
                {char}
            </motion.span>
        ));

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="font-serif italic font-normal leading-[0.92] tracking-tight w-full"
            style={{ fontSize: 'clamp(3.2rem, 16vw, 6rem)' }}
            aria-label="Arya Deep Singh — Backend Developer"
        >
            <div className="block">{renderLine(line1)}</div>
            <div className="block">{renderLine(line2)}</div>
        </motion.div>
    );
};

const NameParticles = () => {
    const colors = useThemeColors();
    const isTouch = useIsTouchDevice();

    return (
        <h1 className="relative w-full mb-4 lg:mb-8 pb-2 lg:pb-4">
            <span className="sr-only">Arya Deep Singh — Backend Developer</span>

            {isTouch ? (
                // Mobile / iOS: Framer Motion text reveal — no canvas, no GPU crash
                <div aria-hidden="true" className="w-full h-[34vw] md:h-[19vw] lg:h-[15.5rem] flex items-center">
                    <MobileNameReveal />
                </div>
            ) : (
                // Desktop: Full particle canvas animation — unchanged
                <div aria-hidden="true" className="w-full h-[34vw] md:h-[19vw] lg:h-[15.5rem]">
                    <ParticleText
                        text={'Arya\nDeep Singh'}
                        colors={colors}
                        mode="onEnter"
                        position="above"
                        replay={false}
                        autoFit
                        fontSize={260}
                        align="left"
                        fontFamily='"Instrument Serif", Georgia, serif'
                        fontWeight={400}
                        italic
                        lineHeightMultiplier={0.92}
                        particleSize={8}
                        particleCount={50}
                        mouseEnabled
                        mouseRadius={70}
                        mouseForce={28}
                        transition={{ type: 'tween', duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                </div>
            )}
        </h1>
    );
};

export default NameParticles;

