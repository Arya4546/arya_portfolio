"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSecret = void 0;
const env_1 = require("../config/env");
const requireSecret = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const expected = `Bearer ${env_1.env.ACTIVITY_SECRET}`;
    if (!authHeader || authHeader !== expected) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
};
exports.requireSecret = requireSecret;
//# sourceMappingURL=auth.middleware.js.map