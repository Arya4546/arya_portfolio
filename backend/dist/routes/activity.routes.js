"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activity_controller_1 = require("../controllers/activity.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public endpoints
router.get('/activity', activity_controller_1.getActivity);
router.get('/activity/statuses', activity_controller_1.getAllowedStatuses);
// Protected endpoint
router.post('/activity', auth_middleware_1.requireSecret, activity_controller_1.setActivity);
exports.default = router;
//# sourceMappingURL=activity.routes.js.map