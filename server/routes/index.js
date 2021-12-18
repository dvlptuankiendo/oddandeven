import express from 'express';

import accountRoute from './account.route.js';
import betRoute from './bet.route.js';
import rankingRoute from './ranking.route.js';

import auth from '../middlewares/auth.middleware.js'

const router = express.Router();

router.use('/v1/account', accountRoute);
router.use('/v1/bet', auth, betRoute);
router.use('/v1/ranking', rankingRoute);

export default router;