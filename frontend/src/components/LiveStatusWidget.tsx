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

function getStatusIcon(statusLabel: string): ComponentType<LucideProps> {
  return ICON_MAP[statusLabel] ?? CloudOff;
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
      // Fail silently — show offline fallback only if we never got data
      if (!hasReceivedData.current) {
        setActivity({ statusLabel: 'Offline', icon: null, appName: null, startedAt: null });
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Poll the API
  useEffect(() => {
    fetchActivity();
    const interval = setInterval(fetchActivity, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchActivity]);

  // Update the "X min ago" text periodically
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), TIME_UPDATE_MS);
    return () => clearInterval(timer);
  }, []);

  const isOffline = activity?.statusLabel === 'Offline';
  const StatusIcon = useMemo(
    () => getStatusIcon(activity?.statusLabel ?? 'Offline'),
    [activity?.statusLabel]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full rounded-xl border border-foreground/10 bg-accent/5 backdrop-blur-md overflow-hidden"
    >
      <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
        {/* Pulse + Label */}
        <div className="flex items-center gap-2 shrink-0">
          <PulseDot isOffline={isOffline} />
          <span
            className={`text-[10px] uppercase tracking-[0.2em] font-semibold font-mono ${
              isOffline ? 'text-foreground/30' : 'text-emerald-400'
            }`}
          >
            {isOffline ? 'Away' : 'Live'}
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-foreground/10 shrink-0" />

        {/* Status Content */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-foreground/30 font-mono"
              >
                loading…
              </motion.span>
            ) : (
              <motion.div
                key={activity?.statusLabel ?? 'offline'}
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex items-center gap-2 min-w-0"
              >
                <div className="w-6 h-6 rounded-md bg-foreground/[0.06] flex items-center justify-center shrink-0">
                  <StatusIcon size={13} strokeWidth={1.8} className="text-foreground/50" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground/80 font-mono truncate">
                  {activity?.statusLabel ?? 'Offline'}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Time ago */}
        {!loading && activity?.startedAt && (
          <span className="text-[10px] text-foreground/25 font-mono whitespace-nowrap shrink-0 hidden sm:block">
            {timeAgo(activity.startedAt)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
