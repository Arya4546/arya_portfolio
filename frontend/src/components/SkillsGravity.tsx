import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import Matter from 'matter-js';
import type { IconType } from 'react-icons';
import {
    SiReact,
    SiNextdotjs,
    SiTypescript,
    SiTailwindcss,
    SiFramer,
    SiNodedotjs,
    SiExpress,
    SiPython,
    SiGo,
    SiPostgresql,
    SiMongodb,
    SiRedis,
    SiFirebase,
    SiDocker,
    SiGit,
    SiVercel,
    SiLinux,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';

interface Skill {
    name: string;
    Icon: IconType;
}

const skills: Skill[] = [
    { name: 'React', Icon: SiReact },
    { name: 'Next.js', Icon: SiNextdotjs },
    { name: 'TypeScript', Icon: SiTypescript },
    { name: 'Tailwind CSS', Icon: SiTailwindcss },
    { name: 'Framer Motion', Icon: SiFramer },
    { name: 'Node.js', Icon: SiNodedotjs },
    { name: 'Express', Icon: SiExpress },
    { name: 'Python', Icon: SiPython },
    { name: 'Go', Icon: SiGo },
    { name: 'PostgreSQL', Icon: SiPostgresql },
    { name: 'MongoDB', Icon: SiMongodb },
    { name: 'Redis', Icon: SiRedis },
    { name: 'Firebase', Icon: SiFirebase },
    { name: 'Docker', Icon: SiDocker },
    { name: 'AWS', Icon: FaAws },
    { name: 'Git', Icon: SiGit },
    { name: 'Vercel', Icon: SiVercel },
    { name: 'Linux', Icon: SiLinux },
];

type BodyRefs = RefObject<(HTMLDivElement | null)[]>;

function startSimulation(container: HTMLDivElement, bodyRefs: BodyRefs): (() => void) | undefined {
    const reducedMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const rect = container.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    if (width <= 0 || height <= 0) return

    // Chip size scales with the available width so ~18 logos always read
    // comfortably instead of overflowing or shrinking to specks on narrow
    // screens.
    const size = Math.max(52, Math.min(112, width / 7.5))

    const placeStatic = () => {
        // prefers-reduced-motion: skip the simulation entirely and lay
        // everything out in a calm static grid instead.
        const perRow = Math.max(3, Math.floor(width / (size * 1.35)))
        const gap = size * 0.35
        skills.forEach((_, i) => {
            const el = bodyRefs.current[i]
            if (!el) return
            const col = i % perRow
            const row = Math.floor(i / perRow)
            el.style.width = `${size}px`
            el.style.height = `${size}px`
            el.style.transform = `translate3d(${col * (size + gap)}px, ${row * (size + gap)}px, 0)`
            el.style.visibility = 'visible'
        })
    }

    if (reducedMotion) {
        placeStatic()
        return
    }

    const engine = Matter.Engine.create({
        gravity: { x: 0, y: 1 },
        enableSleeping: true,
    })
    const world = engine.world

    const wallThickness = 200
    const walls = [
        Matter.Bodies.rectangle(width / 2, -wallThickness / 2, width + wallThickness * 2, wallThickness, { isStatic: true }),
        Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width + wallThickness * 2, wallThickness, { isStatic: true }),
        Matter.Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height + wallThickness * 2, { isStatic: true }),
        Matter.Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height + wallThickness * 2, { isStatic: true }),
    ]
    Matter.Composite.add(world, walls)

    const bodies = skills.map((_, i) => {
        const x = ((i + 0.5) / skills.length) * width
        const y = size / 2 + i * (size * 0.15 + 10)
        return Matter.Bodies.circle(x, y, size / 2, {
            friction: 0.1,
            frictionAir: 0.02,
        })
    })
    Matter.Composite.add(world, bodies)

    const mouse = Matter.Mouse.create(container)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2 },
    })
    Matter.Composite.add(world, mouseConstraint)
    // `mousewheel`/`mouseup` are real methods Matter attaches at runtime but
    // doesn't declare in its public types — narrow casts, not a blanket
    // `any`, since everything else here is properly typed.
    const rawMouse = mouse as unknown as { mousewheel: EventListener; mouseup: (e: Event) => void }
    // Let the page scroll wheel pass through instead of Matter capturing it.
    mouse.element.removeEventListener('mousewheel', rawMouse.mousewheel)
    mouse.element.removeEventListener('DOMMouseScroll', rawMouse.mousewheel)

    const onPointerLeave = () => rawMouse.mouseup(new Event('mouseup'))
    container.addEventListener('mouseleave', onPointerLeave)

    let rafId = 0
    const tick = () => {
        rafId = requestAnimationFrame(tick)
        Matter.Engine.update(engine)
        for (let i = 0; i < bodies.length; i++) {
            const el = bodyRefs.current[i]
            if (!el) continue
            const { position, angle } = bodies[i]
            el.style.width = `${size}px`
            el.style.height = `${size}px`
            el.style.transform = `translate3d(${position.x - size / 2}px, ${position.y - size / 2}px, 0) rotate(${angle}rad)`
            el.style.visibility = 'visible'
        }
    }
    tick()

    return () => {
        cancelAnimationFrame(rafId)
        container.removeEventListener('mouseleave', onPointerLeave)
        Matter.Composite.clear(world, false)
        Matter.Engine.clear(engine)
    }
}

/**
 * Skill logos dropped into a Matter.js gravity well: they fall in, settle,
 * and can be flicked around by mouse/touch drag — adapted from an Originkit
 * "Gravity Gallery" export, with image bodies swapped for icon chips styled
 * to the site's monochrome theme tokens so they read correctly in both
 * light and dark without any color logic of their own.
 */
const SkillsGravity = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const bodyRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [resizeGen, setResizeGen] = useState(0);

    // Only rebuild the simulation on a real shape change — mobile browsers
    // wobble the viewport by tens of px when the address bar shows/hides on
    // scroll, and rebuilding the physics world on that would jolt every
    // settled chip mid-scroll.
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return
        let lastW = -1
        let lastH = -1
        const ro = new ResizeObserver(() => {
            const rect = container.getBoundingClientRect()
            const w = Math.round(rect.width)
            const h = Math.round(rect.height)
            if (lastW < 0) {
                lastW = w
                lastH = h
                return
            }
            if (Math.abs(w - lastW) > 40 || Math.abs(h - lastH) > 80) {
                lastW = w
                lastH = h
                setResizeGen((g) => g + 1)
            }
        })
        ro.observe(container)
        return () => ro.disconnect()
    }, [])

    // The engine used to start the instant this component mounted, which for
    // a section this far down the page meant the whole drop-and-settle
    // animation played off-screen before anyone scrolled to it — visitors
    // only ever saw the already-settled pile, never the actual motion. Wait
    // for the section to actually enter the viewport before dropping the
    // chips in.
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        let cancelled = false
        let cleanupPhysics: (() => void) | undefined

        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || cancelled) return
                io.disconnect()
                cleanupPhysics = startSimulation(container, bodyRefs)
            },
            { threshold: 0.15 }
        )
        io.observe(container)

        return () => {
            cancelled = true
            io.disconnect()
            cleanupPhysics?.()
        }
    }, [resizeGen])

    return (
        <div
            ref={containerRef}
            className="relative w-full h-[46vh] min-h-[320px] max-h-[460px] overflow-hidden select-none"
        >
            {skills.map((skill, i) => (
                <div
                    key={skill.name}
                    ref={(el) => {
                        bodyRefs.current[i] = el
                    }}
                    className="absolute left-0 top-0 flex items-center justify-center rounded-full bg-accent/60 border border-foreground/10 backdrop-blur-sm cursor-grab active:cursor-grabbing touch-none hover:bg-accent hover:border-foreground/20 transition-colors"
                    style={{ visibility: 'hidden', willChange: 'transform' }}
                >
                    <skill.Icon className="w-[42%] h-[42%] text-foreground/80" aria-hidden="true" />
                    <span className="sr-only">{skill.name}</span>
                </div>
            ))}
        </div>
    )
};

export default SkillsGravity;
