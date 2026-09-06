"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamActivity = exports.getAllowedStatuses = exports.getActivity = exports.setActivity = void 0;
const activityStatus_model_1 = __importDefault(require("../models/activityStatus.model"));
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
// SSE Client management
const clients = new Set();
const broadcast = (data) => {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    for (const client of clients) {
        try {
            client.write(payload);
        }
        catch (err) {
            clients.delete(client);
        }
    }
};
const setActivity = async (req, res) => {
    try {
        const { statusLabel, appName, icon } = req.body;
        if (!statusLabel || typeof statusLabel !== 'string') {
            res.status(400).json({ error: 'statusLabel is required and must be a string' });
            return;
        }
        // Case-insensitive match and normalization
        const normalizedStatus = Array.from(ALLOWED_STATUSES).find((status) => status.toLowerCase() === statusLabel.toLowerCase());
        if (!normalizedStatus) {
            res.status(400).json({
                error: `Unknown statusLabel: "${statusLabel}"`,
                allowed: Array.from(ALLOWED_STATUSES).sort(),
            });
            return;
        }
        // Deactivate any currently active status
        await activityStatus_model_1.default.update({ isActive: false }, { where: { isActive: true } });
        const created = await activityStatus_model_1.default.create({
            statusLabel: normalizedStatus,
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
        // Broadcast update to all connected SSE clients
        broadcast({
            statusLabel: created.statusLabel,
            icon: created.icon,
            appName: created.appName,
            startedAt: created.startedAt,
        });
    }
    catch (err) {
        console.error('setActivity error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.setActivity = setActivity;
const getActivity = async (_req, res) => {
    try {
        const current = await activityStatus_model_1.default.findOne({
            where: { isActive: true },
            order: [['startedAt', 'DESC']],
            attributes: ['statusLabel', 'appName', 'icon', 'startedAt'],
        });
        // Staleness guard: if no active status or older than threshold, return Offline
        const isStale = !current ||
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
    }
    catch (err) {
        console.error('getActivity error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getActivity = getActivity;
const getAllowedStatuses = (_req, res) => {
    res.json({ statuses: Array.from(ALLOWED_STATUSES).sort() });
};
exports.getAllowedStatuses = getAllowedStatuses;
const streamActivity = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Send current state immediately on connection
    try {
        const current = await activityStatus_model_1.default.findOne({
            where: { isActive: true },
            order: [['startedAt', 'DESC']],
            attributes: ['statusLabel', 'appName', 'icon', 'startedAt'],
        });
        const isStale = !current ||
            Date.now() - new Date(current.startedAt).getTime() > STALE_THRESHOLD_MS;
        const data = isStale ? {
            statusLabel: 'Offline',
            icon: 'cloud-off',
            appName: null,
            startedAt: null,
        } : {
            statusLabel: current.statusLabel,
            icon: current.icon,
            appName: current.appName,
            startedAt: current.startedAt,
        };
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
    catch (err) {
        console.error('Initial stream fetch error:', err);
    }
    clients.add(res);
    req.on('close', () => {
        clients.delete(res);
    });
};
exports.streamActivity = streamActivity;
//# sourceMappingURL=activity.controller.js.map