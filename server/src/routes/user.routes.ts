import { Router } from 'express';

import * as userController from '../controllers/user.controllers.js';
import { authJwtMW } from '../lib/passport/index.js';
import { validatorMW } from '../middleware/validator.middleware.js';
import { createUserValidator } from '../validator/user.validator.js';

const createUserValidatorMW = validatorMW({
    validateOn: 'body',
    validator: createUserValidator,
});

const router = Router();

router.post('/', createUserValidatorMW, userController.createUser);

router.get('/', authJwtMW, userController.getAllUsers);

router.get('/:id', authJwtMW, userController.getUser);

export default router;
