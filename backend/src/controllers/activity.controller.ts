import { Request, Response } from 'express';
import ActivityStatus from '../models/activityStatus.model';

/**
 * Expanded whitelist of allowed statuses.
 * Prevents arbitrary text from being posted if the secret token leaks.
 * Organized by category for maintainability.
 */
const ALLOWED_STATUSES = new Set([
  // Development & Work
  'Coding',
  'Debugging',
  'Designing',
  'Writing',
  'In a Meeting',
  'On a Call',
  'Reviewing Code',

  // Learning
  'Studying',
  'Reading',
  'Researching',

  // Entertainment
  'Listening to Music',
  'Watching Movies',
  'Gaming',
  'Scrolling Reels',
  'Browsing',
  'Streaming',
  'Photography',

  // Travel & Fitness
  'Driving',
  'Traveling',
  'Walking',
  'Working Out',
  'Commuting',
  'Cycling',

  // Food & Lifestyle
  'Ordering Food',
  'Coffee Break',
  'Cooking',
  'Shopping Online',
  'At a Restaurant',

  // Rest & Status
  'Sleeping',
  'Meditating',
  'Offline',
]);

/** 30-minute staleness threshold (ms) */
const STALE_THRESHOLD_MS = 30 * 60 * 1000;

export const setActivity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { statusLabel, appName, icon } = req.body;

    if (!statusLabel || typeof statusLabel !== 'string') {
      res.status(400).json({ error: 'statusLabel is required and must be a string' });
      return;
    }

    if (!ALLOWED_STATUSES.has(statusLabel)) {
      res.status(400).json({
        error: `Unknown statusLabel: "${statusLabel}"`,
        allowed: Array.from(ALLOWED_STATUSES).sort(),
      });
      return;
    }

    // Deactivate any currently active status
    await ActivityStatus.update(
      { isActive: false },
      { where: { isActive: true } }
    );

    const created = await ActivityStatus.create({
      statusLabel,
      appName: appName ?? null,
      icon: icon ?? null,
      startedAt: new Date(),
      isActive: true,
    });

    res.status(201).json({
      id: created.id,
      statusLabel: created.statusLabel,
      appName: created.appName,
      icon: created.icon,
      startedAt: created.startedAt,
      isActive: created.isActive,
    });
  } catch (err) {
    console.error('setActivity error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActivity = async (_req: Request, res: Response): Promise<void> => {
  try {
    const current = await ActivityStatus.findOne({
      where: { isActive: true },
      order: [['startedAt', 'DESC']],
      attributes: ['statusLabel', 'appName', 'icon', 'startedAt'],
    });

    // Staleness guard: if no active status or older than threshold, return Offline
    const isStale =
      !current ||
      Date.now() - new Date(current.startedAt).getTime() > STALE_THRESHOLD_MS;

    if (isStale) {
      res.json({
        statusLabel: 'Offline',
        icon: 'cloud-off',
        appName: null,
        startedAt: null,
      });
      return;
    }

    res.json({
      statusLabel: current.statusLabel,
      icon: current.icon,
      appName: current.appName,
      startedAt: current.startedAt,
    });
  } catch (err) {
    console.error('getActivity error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllowedStatuses = (_req: Request, res: Response): void => {
  res.json({ statuses: Array.from(ALLOWED_STATUSES).sort() });
};
