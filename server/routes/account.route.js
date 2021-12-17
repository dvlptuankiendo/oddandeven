import express from 'express';
import accountController from '../controllers/account.controller.js';

const router = express.Router();

router.post('/logIn', accountController.logIn);
router.post('/register', accountController.register);

export default router;
