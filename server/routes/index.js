import express from 'express';

import accountRoute from './account.route.js';

const router = express.Router();

router.use('/v1/account', accountRoute);

export default router;