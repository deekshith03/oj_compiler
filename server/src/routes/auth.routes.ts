import { Router } from 'express';

import * as authController from '../controllers/auth.controller.js';
import { userNamePasswordMW } from '../lib/passport/index.js';

const router = Router();

router.post('/login', userNamePasswordMW, authController.login);

export default router;
