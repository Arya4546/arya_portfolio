import { useEffect, useState } from 'react';
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

const NameParticles = () => {
    const colors = useThemeColors();

    return (
        <h1 className="relative w-full mb-4 lg:mb-8 pb-2 lg:pb-4">
            <span className="sr-only">Arya Deep Singh — Backend Developer</span>
            {/* Single canvas for both lines: they must share one auto-fit pass so
                "Arya" and "Deep Singh" render at the exact same size — fitting each
                line's own canvas independently made the shorter word render larger.
                Box height (not width) is what auto-fit sizes off for a two-line
                block, so it needs real headroom — too tight here and both lines
                get shrunk well below the original single-line 7rem/8vw/14vw scale
                just to keep from clipping vertically. */}
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
        </h1>
    );
};

export default NameParticles;
