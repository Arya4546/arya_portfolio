import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Bug, Palette, PenTool, GraduationCap, BookOpen,
  Car, Plane, Footprints, Dumbbell, Bike, Film, Gamepad2, Smartphone, Globe, Camera, Radio,
  ShoppingBag, UtensilsCrossed, Coffee, CookingPot,
  Users, Phone, GitPullRequest,
  Moon, CloudOff, Brain, Train, Search,
  X, ExternalLink,
} from 'lucide-react';
import { SiSpotify, SiInstagram, SiSteam, SiDiscord, SiGooglechrome, SiNetflix, SiYoutube, SiGithub, SiFigma } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';
import { FaGamepad } from 'react-icons/fa';
import type { ComponentType } from 'react';

/* ─── Types ────────────────────────────────────────────────── */

interface ActivityData {
  statusLabel: string;
  icon: string | null;
  appName: string | null;
  startedAt: string | null;
}

interface StatusTextStructure {
  verb: string;
  noun?: string;
}

/* ─── Config ───────────────────────────────────────────────── */

const API_URL = import.meta.env.VITE_ACTIVITY_API_URL || 'http://localhost:4000/api/activity';
const POLL_INTERVAL_MS = 20_000;
const TIME_UPDATE_MS = 30_000;

/* ─── Icon Registry ────────────────────────────────────────── */

const ICON_MAP: Record<string, ComponentType<any>> = {
  // Development & Work
  'Coding':            Terminal,
  'Debugging':         Bug,
  'Designing':         Palette,
  'Writing':           PenTool,
  'In a Meeting':      Users,
  'On a Call':         Phone,
  'Reviewing Code':    GitPullRequest,

  // Learning
  'Studying':          GraduationCap,
  'Reading':           BookOpen,
  'Researching':       Search,

  // Entertainment
  'Watching Movies':   Film,
  'Gaming':            Gamepad2,
  'Scrolling Reels':   Smartphone,
  'Browsing':          Globe,
  'Streaming':         Radio,
  'Photography':       Camera,

  // Travel & Fitness
  'Driving':           Car,
  'Traveling':         Plane,
  'Walking':           Footprints,
  'Working Out':       Dumbbell,
  'Commuting':         Train,
  'Cycling':           Bike,

  // Food & Lifestyle
  'Ordering Food':     UtensilsCrossed,
  'Coffee Break':      Coffee,
  'Cooking':           CookingPot,
  'Shopping Online':   ShoppingBag,
  'At a Restaurant':   UtensilsCrossed,

  // Rest & Status
  'Sleeping':          Moon,
  'Meditating':        Brain,
  'Offline':           CloudOff,
};

/* ─── Helpers ──────────────────────────────────────────────── */

function timeAgo(dateString: string | null): string {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 30) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return 'just now';
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hr ago';
  if (hours < 24) return `${hours} hrs ago`;
  return 'a while ago';
}

function formatStatusText(statusLabel: string, appName: string | null): StatusTextStructure {
  switch (statusLabel) {
    case 'Coding':
      return { verb: 'Currently coding', noun: appName ? `in ${appName}` : '' };
    case 'Debugging':
      return { verb: 'Currently debugging', noun: appName ? `in ${appName}` : '' };
    case 'Designing':
      return { verb: 'Currently designing', noun: appName ? `in ${appName}` : '' };
    case 'Writing':
      return { verb: 'Currently writing', noun: appName ? `in ${appName}` : '' };
    case 'In a Meeting':
      return { verb: 'Currently in a meeting', noun: appName ? `on ${appName}` : '' };
    case 'On a Call':
      return { verb: 'Currently on a call', noun: appName ? `via ${appName}` : '' };
    case 'Reviewing Code':
      return { verb: 'Currently reviewing code' };
    case 'Studying':
      return { verb: 'Currently studying' };
    case 'Reading':
      return { verb: 'Currently reading' };
    case 'Researching':
      return { verb: 'Currently researching', noun: appName ? `using ${appName}` : '' };
    case 'Listening to Music':
      return { verb: 'Currently listening', noun: appName ? `to music on ${appName}` : 'to music' };
    case 'Watching Movies':
      return { verb: 'Currently watching', noun: appName ? `on ${appName}` : 'a movie' };
    case 'Gaming':
      return { verb: 'Currently gaming', noun: appName ? `on ${appName}` : 'games' };
    case 'Scrolling Reels':
      return { verb: 'Currently scrolling', noun: appName ? `on ${appName}` : 'reels' };
    case 'Browsing':
      return { verb: 'Currently browsing', noun: appName ? `on ${appName}` : '' };
    case 'Streaming':
      return { verb: 'Currently streaming' };
    case 'Photography':
      return { verb: 'Currently shooting photos' };
    case 'Driving':
      return { verb: 'Currently driving' };
    case 'Traveling':
      return { verb: 'Currently traveling' };
    case 'Walking':
      return { verb: 'Currently walking' };
    case 'Working Out':
      return { verb: 'Currently working out' };
    case 'Commuting':
      return { verb: 'Currently commuting' };
    case 'Cycling':
      return { verb: 'Currently cycling' };
    case 'Ordering Food':
      return { verb: 'Currently ordering food', noun: appName ? `on ${appName}` : '' };
    case 'Coffee Break':
      return { verb: 'Currently on a coffee break' };
    case 'Cooking':
      return { verb: 'Currently cooking' };
    case 'Shopping Online':
      return { verb: 'Currently shopping online', noun: appName ? `on ${appName}` : '' };
    case 'At a Restaurant':
      return { verb: 'Currently at a restaurant' };
    case 'Sleeping':
      return { verb: 'Currently sleeping' };
    case 'Meditating':
      return { verb: 'Currently meditating' };
    default:
      return { verb: 'Currently offline' };
  }
}

/* ─── Pulse Dot ────────────────────────────────────────────── */

const PulseDot = ({ isOffline }: { isOffline: boolean }) => (
  <span className="relative flex h-2.5 w-2.5 shrink-0">
    {!isOffline && (
      <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping" />
    )}
    <span
      className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
        isOffline ? 'bg-white/20' : 'bg-white'
      }`}
      style={!isOffline ? { boxShadow: '0 0 8px #FFFFFF, 0 0 16px rgba(255, 255, 255, 0.4)' } : {}}
    />
  </span>
);

/* ─── Micro Visualizers ────────────────────────────────────── */

const MusicVisualizer = () => (
  <div className="flex items-end gap-[3px] h-6 px-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.span
        key={i}
        className="w-[3px] bg-white/90 rounded-full"
        animate={{ height: ['4px', '22px', '8px', '18px', '4px'] }}
        transition={{
          duration: 1 + i * 0.12,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

const TerminalVisualizer = () => (
  <div className="font-mono text-[10px] text-white/80 bg-white/5 px-3 py-2 rounded-lg border border-white/10 w-full flex items-center gap-1.5 select-none">
    <span>$</span>
    <span className="text-[10px] text-white/40">compiling arya_portfolio...</span>
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
      className="w-1.5 h-3 bg-white"
    />
  </div>
);

/* ─── Dynamic Island Component ─────────────────────────────── */

export default function LiveStatusWidget() {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [, setTick] = useState(0);
  const [state, setState] = useState<'compact' | 'medium' | 'expanded'>('compact');
  const [scrolled, setScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const hasReceivedData = useRef(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchActivity = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: ActivityData = await res.json();
      setActivity(data);
      hasReceivedData.current = true;
    } catch {
      if (!hasReceivedData.current) {
        setActivity({ statusLabel: 'Offline', icon: null, appName: null, startedAt: null });
      }
    }
  }, []);

  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchActivity]);

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), TIME_UPDATE_MS);
    return () => clearInterval(timer);
  }, []);

  // Track scrolling to adjust dynamic top offset positioning
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Collapse when clicking outside the widget (especially useful on mobile)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setState('compact');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isOffline = !activity || activity.statusLabel === 'Offline';

  // Retrieve proper icon depending on active status and platform
  const StatusIcon = useMemo(() => {
    if (isOffline) return CloudOff;
    const label = activity?.statusLabel;
    const app = activity?.appName?.toLowerCase() ?? '';
    
    if (label === 'Coding' || label === 'Debugging') {
      return VscVscode;
    }
    if (label === 'Listening to Music') {
      return SiSpotify;
    }
    if (label === 'Scrolling Reels' || label === 'Instagram') {
      return SiInstagram;
    }
    if (label === 'Gaming') {
      if (app.includes('steam')) return SiSteam;
      if (app.includes('discord')) return SiDiscord;
      return FaGamepad;
    }
    if (label === 'Browsing' || label === 'Researching') {
      if (app.includes('chrome')) return SiGooglechrome;
      return Search;
    }
    if (label === 'Watching Movies' || label === 'Streaming') {
      if (app.includes('youtube')) return SiYoutube;
      if (app.includes('netflix')) return SiNetflix;
      return Film;
    }
    if (label === 'Reviewing Code') {
      return SiGithub;
    }
    if (label === 'Designing') {
      if (app.includes('figma')) return SiFigma;
      return Palette;
    }
    return ICON_MAP[label ?? 'Offline'] ?? CloudOff;
  }, [activity?.statusLabel, activity?.appName, isOffline]);

  // Determine official brand colors dynamically
  const IconColor = useMemo(() => {
    if (isOffline) return 'currentColor';
    const label = activity?.statusLabel;
    const app = activity?.appName?.toLowerCase() ?? '';

    if (label === 'Listening to Music') return '#1DB954'; // Spotify Brand Green
    if (label === 'Coding' || label === 'Debugging') return '#007ACC'; // VS Code Brand Blue
    if (label === 'Scrolling Reels' || label === 'Instagram') return '#E1306C'; // Instagram Pink
    if (label === 'Gaming') {
      if (app.includes('steam')) return '#66C0F4'; // Steam Blue
      if (app.includes('discord')) return '#5865F2'; // Discord Purple
      return '#A855F7'; // Gamepad Purple
    }
    if (label === 'Browsing' || label === 'Researching') return '#4285F4'; // Chrome Blue
    if (label === 'Watching Movies' || label === 'Streaming') {
      if (app.includes('youtube')) return '#FF0000'; // Youtube Red
      return '#E50914'; // Netflix Red
    }
    if (label === 'Reviewing Code') return '#E2E8F0'; // GitHub Silver
    if (label === 'Designing') return '#F24E1E'; // Figma Orange
    return 'currentColor';
  }, [activity?.statusLabel, activity?.appName, isOffline]);

  // Determine ambient glow colors for the dark theme visibility
  const boxStyle = useMemo(() => {
    let ambientColor = 'rgba(255, 255, 255, 0.08)';
    let borderOpacity = isHovered ? '0.35' : '0.24';
    let glowIntensity = isHovered ? '25px' : '15px';

    if (!isOffline) {
      const label = activity?.statusLabel;
      const app = activity?.appName?.toLowerCase() ?? '';
      const multiplier = isHovered ? 1.4 : 1.0;
      
      if (label === 'Listening to Music') {
        ambientColor = `rgba(29, 185, 84, ${0.28 * multiplier})`;
      } else if (label === 'Coding' || label === 'Debugging') {
        ambientColor = `rgba(0, 122, 204, ${0.28 * multiplier})`;
      } else if (label === 'Scrolling Reels' || label === 'Instagram') {
        ambientColor = `rgba(225, 48, 108, ${0.28 * multiplier})`;
      } else if (label === 'Gaming') {
        if (app.includes('steam')) ambientColor = `rgba(102, 192, 244, ${0.28 * multiplier})`;
        else if (app.includes('discord')) ambientColor = `rgba(88, 101, 242, ${0.28 * multiplier})`;
        else ambientColor = `rgba(168, 85, 247, ${0.28 * multiplier})`;
      } else if (label === 'Browsing' || label === 'Researching') {
        ambientColor = `rgba(66, 133, 244, ${0.28 * multiplier})`;
      } else if (label === 'Watching Movies' || label === 'Streaming') {
        ambientColor = `rgba(229, 9, 20, ${0.28 * multiplier})`;
      } else if (label === 'Designing') {
        ambientColor = `rgba(242, 78, 30, ${0.28 * multiplier})`;
      } else {
        ambientColor = `rgba(255, 255, 255, ${0.12 * multiplier})`;
      }
    } else {
      const multiplier = isHovered ? 1.4 : 1.0;
      // High contrast offline glow to ensure visibility on absolute dark backgrounds
      ambientColor = `rgba(255, 255, 255, ${0.12 * multiplier})`;
    }

    return {
      boxShadow: `0 12px 40px rgba(0, 0, 0, 0.85), 0 0 ${glowIntensity} ${ambientColor}`,
      border: `1px solid rgba(255, 255, 255, ${borderOpacity})`,
    };
  }, [activity?.statusLabel, activity?.appName, isOffline, isHovered]);

  const statusParts = useMemo(
    () => formatStatusText(activity?.statusLabel ?? 'Offline', activity?.appName ?? null),
    [activity?.statusLabel, activity?.appName]
  );

  // iOS-style elastic springs
  const springTransition = {
    type: 'spring' as const,
    stiffness: 350,
    damping: 26,
    mass: 0.8,
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (state !== 'expanded') {
      setState('medium');
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (state !== 'expanded') {
      hoverTimeout.current = setTimeout(() => {
        setState('compact');
      }, 150); // 150ms timeout for instant response on leave
    }
  };

  return (
    <div
      ref={widgetRef}
      className={`fixed left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ease-out pointer-events-auto
        ${scrolled ? 'top-[80px]' : 'top-[112px]'}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        layout
        transition={springTransition}
        style={boxStyle}
        onClick={() => {
          if (state === 'expanded') {
            setState('compact');
          } else {
            setState('expanded');
          }
        }}
        className={`bg-zinc-950/98 text-white backdrop-blur-md cursor-pointer select-none overflow-hidden flex items-center justify-between
          ${state === 'compact' ? 'w-[140px] h-[36px] rounded-full px-3.5' : ''}
          ${state === 'medium' ? 'w-[220px] h-[36px] rounded-full px-4' : ''}
          ${state === 'expanded' ? 'w-[calc(100vw-32px)] sm:w-[360px] h-auto rounded-[28px] p-5 flex-col gap-4' : ''}
        `}
      >
        <AnimatePresence mode="wait">
          {state === 'compact' && (
            <motion.div
              key="compact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2">
                <PulseDot isOffline={isOffline} />
                <span className="text-[10px] tracking-[0.2em] font-mono text-white/95 font-bold uppercase select-none">
                  {isOffline ? 'OFFLINE' : 'LIVE'}
                </span>
              </div>
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <StatusIcon className="w-full h-full" style={{ color: IconColor }} />
              </div>
            </motion.div>
          )}

          {state === 'medium' && (
            <motion.div
              key="medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-between w-full"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <PulseDot isOffline={isOffline} />
                <span className="text-[10px] font-medium tracking-wider truncate text-white/90">
                  {isOffline ? 'Currently Offline' : activity?.statusLabel}
                </span>
              </div>
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <StatusIcon className="w-full h-full" style={{ color: IconColor }} />
              </div>
            </motion.div>
          )}

          {state === 'expanded' && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col w-full text-left"
              onClick={(e) => e.stopPropagation()} // Prevent clicking child items from closing the island
            >
              {/* Header row */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <PulseDot isOffline={isOffline} />
                  <span className="text-[9px] font-mono tracking-[0.3em] text-white/40 uppercase">
                    {isOffline ? 'OFFLINE' : 'LIVE ACTIVITY'}
                  </span>
                </div>
                <button
                  onClick={() => setState('compact')}
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Status information with App-Icon styling */}
              <div className="flex items-center gap-4 mt-1">
                {/* Real iOS App Icon container */}
                <div className="w-12 h-12 rounded-[10px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <StatusIcon className="w-full h-full" style={{ color: IconColor }} />
                  </div>
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-baseline flex-wrap gap-x-1.5">
                    <h3 className="text-lg sm:text-xl font-serif italic text-white leading-tight">
                      {statusParts.verb}
                    </h3>
                    {statusParts.noun && (
                      <span className="text-sm sm:text-base font-sans font-normal text-white/50 leading-tight">
                        {statusParts.noun}
                      </span>
                    )}
                  </div>

                  {!isOffline && activity?.startedAt && (
                    <span className="text-[10px] text-white/40 font-mono tracking-wide lowercase mt-0.5">
                      active since {timeAgo(activity.startedAt)}
                    </span>
                  )}
                </div>
              </div>

              {/* Custom Micro-Visualizer / Graphic */}
              <div className="mt-4 flex items-center justify-start min-h-[24px]">
                {activity?.statusLabel === 'Listening to Music' && <MusicVisualizer />}
                {(activity?.statusLabel === 'Coding' || activity?.statusLabel === 'Debugging') && <TerminalVisualizer />}
                {activity?.statusLabel !== 'Listening to Music' &&
                  activity?.statusLabel !== 'Coding' &&
                  activity?.statusLabel !== 'Debugging' && (
                    <div className="w-full h-[1px] bg-white/10" />
                  )}
              </div>

              {/* Interactive bottom link */}
              <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-white/30 font-mono">
                  ag-island v1.0
                </span>
                <a
                  href="#contact"
                  onClick={() => setState('compact')}
                  className="text-[10px] font-sans font-medium text-white/90 hover:text-white border-b border-white/20 hover:border-white/60 flex items-center gap-1 transition-colors"
                >
                  Get in touch
                  <ExternalLink size={10} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
