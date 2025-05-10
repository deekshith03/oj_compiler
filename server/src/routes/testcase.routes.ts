import { Router } from 'express';

import * as testcaseController from '../controllers/testcase.controllers.js';
import { authJwtMW } from '../lib/passport/index.js';

const router = Router();

router.put('/:id', authJwtMW, testcaseController.updateTestcase);

export default router;
