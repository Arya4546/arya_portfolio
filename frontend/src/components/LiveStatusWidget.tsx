import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, Bug, Palette, PenTool, GraduationCap, BookOpen,
  Car, Plane, Footprints, Dumbbell, Bike,
  Headphones, Film, Gamepad2, Smartphone, Globe, Camera, Radio,
  ShoppingBag, UtensilsCrossed, Coffee, CookingPot,
  Users, Phone, GitPullRequest,
  Moon, CloudOff, Brain, Train,
  type LucideProps,
} from 'lucide-react';
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

const ICON_MAP: Record<string, ComponentType<LucideProps>> = {
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

  // Entertainment
  'Listening to Music': Headphones,
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
      return { verb: 'Currently in a meeting' };
    case 'On a Call':
      return { verb: 'Currently on a call' };
    case 'Reviewing Code':
      return { verb: 'Currently reviewing code' };
    case 'Studying':
      return { verb: 'Currently studying' };
    case 'Reading':
      return { verb: 'Currently reading' };
    case 'Listening to Music':
      return { verb: 'Currently listening', noun: 'to music' };
    case 'Watching Movies':
      return { verb: 'Currently watching', noun: appName ? `on ${appName}` : 'a movie' };
    case 'Gaming':
      return { verb: 'Currently gaming', noun: appName ? `on ${appName}` : 'games' };
    case 'Scrolling Reels':
      return { verb: 'Currently scrolling', noun: appName ? `on ${appName}` : 'reels' };
    case 'Browsing':
      return { verb: 'Currently browsing' };
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
      return { verb: 'Currently shopping online' };
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
  <span className="relative flex h-2 w-2 shrink-0">
    {!isOffline && (
      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
    )}
    <span
      className={`relative inline-flex h-2 w-2 rounded-full ${
        isOffline ? 'bg-foreground/20' : 'bg-emerald-400'
      }`}
    />
  </span>
);

/* ─── Component ────────────────────────────────────────────── */

export default function LiveStatusWidget() {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);
  const hasReceivedData = { current: false };

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
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const isOffline = activity?.statusLabel === 'Offline';
  const StatusIcon = useMemo(
    () => ICON_MAP[activity?.statusLabel ?? 'Offline'] ?? CloudOff,
    [activity?.statusLabel]
  );
  const statusParts = useMemo(
    () => formatStatusText(activity?.statusLabel ?? 'Offline', activity?.appName ?? null),
    [activity?.statusLabel, activity?.appName]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="flex flex-col items-start gap-1.5"
    >
      {/* Small live badge row */}
      <div className="flex items-center gap-2">
        <PulseDot isOffline={isOffline} />
        <span
          className={`text-[9px] uppercase tracking-[0.25em] font-bold font-mono ${
            isOffline ? 'text-foreground/30' : 'text-emerald-500/90'
          }`}
        >
          {isOffline ? 'Offline Status' : 'Live Status'}
        </span>
        {/* Time Ago (Only when live) */}
        {!loading && !isOffline && activity?.startedAt && (
          <span className="text-[9px] text-foreground/30 font-mono tracking-normal lowercase">
            ({timeAgo(activity.startedAt)})
          </span>
        )}
      </div>

      {/* Main statement with beautiful serif italic typography */}
      <div className="flex items-baseline flex-wrap gap-x-2">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-base sm:text-lg font-mono text-foreground/30"
            >
              checking activity...
            </motion.span>
          ) : (
            <motion.div
              key={activity?.statusLabel ?? 'offline'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex items-center flex-wrap gap-x-2 text-foreground/70"
            >
              <StatusIcon size={14} strokeWidth={1.5} className="shrink-0 text-foreground/50 mr-0.5" />
              <h3 className="text-lg sm:text-xl font-serif italic text-foreground leading-tight">
                {statusParts.verb}
              </h3>
              {statusParts.noun && (
                <span className="text-sm sm:text-base font-sans font-normal text-foreground/50 leading-tight">
                  {statusParts.noun}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
