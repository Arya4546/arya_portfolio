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
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full max-w-md rounded-2xl border transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
        isOffline
          ? 'border-foreground/10 bg-accent/5 shadow-sm border-l-[6px] border-l-foreground/20'
          : 'border-foreground/10 bg-accent/5 shadow-md border-l-[6px] border-l-emerald-500'
      }`}
    >
      <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
        {/* Left Side: Icon + Activity details */}
        <div className="flex items-center gap-4 min-w-0">
          {/* Status Icon */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
              isOffline
                ? 'bg-foreground/[0.04] border-foreground/5 text-foreground/40'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 dark:text-emerald-400'
            }`}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                  className="w-3.5 h-3.5 border border-foreground/20 border-t-foreground/60 rounded-full"
                />
              ) : (
                <motion.div
                  key={activity?.statusLabel ?? 'offline'}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <StatusIcon size={20} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Details */}
          <div className="min-w-0 flex flex-col">
            <span className="text-[9px] uppercase tracking-[0.2em] font-extrabold text-foreground/45 font-mono mb-0.5">
              Live Activity
            </span>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-foreground/30 font-mono"
                >
                  checking status...
                </motion.span>
              ) : (
                <motion.div
                  key={activity?.statusLabel ?? 'offline'}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col min-w-0"
                >
                  <span className="text-xs sm:text-sm font-bold text-foreground truncate leading-tight">
                    {activity?.statusLabel ?? 'Offline'}
                  </span>
                  {activity?.appName && (
                    <span className="text-[10px] text-foreground/40 font-mono mt-0.5 truncate">
                      using {activity.appName}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: Badge & Time */}
        <div className="flex flex-col items-end shrink-0 gap-1.5">
          <div
            className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider uppercase border flex items-center gap-1.5 ${
              isOffline
                ? 'bg-foreground/[0.04] text-foreground/40 border-foreground/10'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            }`}
          >
            <PulseDot isOffline={isOffline} />
            {isOffline ? 'Away' : 'Live'}
          </div>

          {!loading && activity?.startedAt && (
            <span className="text-[9px] text-foreground/35 font-mono">
              {timeAgo(activity.startedAt)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
