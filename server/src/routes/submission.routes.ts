import { Router } from 'express';

import * as submissionController from '../controllers/submission.controllers.js';
import { authJwtMW } from '../lib/passport/index.js';

const router = Router();

router.get('/', authJwtMW, submissionController.getAllSubmissions);

router.post('/', authJwtMW, submissionController.createSubmission);

export default router;
