import express from 'express';

import accountRoute from './account.route.js';
import auth from '../middlewares/auth.middleware.js'

const router = express.Router();

router.use('/v1/account', accountRoute);

export default router;