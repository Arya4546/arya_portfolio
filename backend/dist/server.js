"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const db_1 = require("./db");
const activity_routes_1 = __importDefault(require("./routes/activity.routes"));
const app = (0, express_1.default)();
// ── Middleware ──────────────────────────────────────────────
app.use(express_1.default.json({ limit: '1kb' }));
app.use((0, cors_1.default)({
    origin: env_1.env.ALLOWED_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Rate limiting: 30 requests per minute per IP
const activityLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later' },
});
app.use('/api/activity', activityLimiter);
// ── Routes ─────────────────────────────────────────────────
app.use('/api', activity_routes_1.default);
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// ── Start ──────────────────────────────────────────────────
const start = async () => {
    await (0, db_1.testConnection)();
    await db_1.sequelize.sync({ alter: env_1.env.NODE_ENV === 'development' });
    console.log('✅ Database schema synchronized');
    app.listen(env_1.env.PORT, () => {
        console.log(`🚀 Activity API running on http://localhost:${env_1.env.PORT}`);
        console.log(`📡 CORS origin: ${env_1.env.ALLOWED_ORIGIN}`);
    });
};
start().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map