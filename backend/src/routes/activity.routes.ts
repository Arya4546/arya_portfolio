import { Router } from 'express';
import { setActivity, getActivity, getAllowedStatuses, streamActivity } from '../controllers/activity.controller';
import { requireSecret } from '../middleware/auth.middleware';

const router = Router();

// Public endpoints
router.get('/activity', getActivity);
router.get('/activity/statuses', getAllowedStatuses);
router.get('/activity/stream', streamActivity);

// Protected endpoint
router.post('/activity', requireSecret, setActivity);

export default router;
