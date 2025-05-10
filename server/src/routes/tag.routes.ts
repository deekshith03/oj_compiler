import { Router } from 'express';

import * as tagController from '../controllers/tag.controllers.js';
import { authJwtMW } from '../lib/passport/index.js';

const router = Router();

router.get('/', authJwtMW, tagController.getAllTags);

router.post('/', authJwtMW, tagController.createTag);

export default router;
