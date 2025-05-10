import { Router } from 'express';

import * as problemController from '../controllers/problem.controllers.js';
import { authJwtMW } from '../lib/passport/index.js';
import checkAdminMW from '../middleware/checkAdmin.middleware.js';
import { validatorMW } from '../middleware/validator.middleware.js';
import {
    createProblemValidator,
    reviewProblemValidator,
    updateProblemParamsValidator,
    updateProblemValidator,
} from '../validator/problem.validator.js';

const createProblemValidatorMW = validatorMW({
    validateOn: 'body',
    validator: createProblemValidator,
});

const updateProblemValidatorMW = validatorMW({
    validateOn: 'body',
    validator: updateProblemValidator,
});

const updateProblemParamsValidatorMW = validatorMW({
    validateOn: 'params',
    validator: updateProblemParamsValidator,
});

const reviewProblemValidatorMW = validatorMW({
    validateOn: 'body',
    validator: reviewProblemValidator,
});

const router = Router();

router.get('/', authJwtMW, problemController.getAllProblems);
router.post(
    '/',
    authJwtMW,
    createProblemValidatorMW,
    problemController.createProblem,
);

router.get('/:id', authJwtMW, problemController.getProblem);
router.put(
    '/:id',
    authJwtMW,
    updateProblemParamsValidatorMW,
    updateProblemValidatorMW,
    problemController.updateProblem,
);

router.put(
    '/:id/review',
    authJwtMW,
    checkAdminMW,
    updateProblemParamsValidatorMW,
    reviewProblemValidatorMW,
    problemController.reviewProblem,
);
router.put(
    '/:id/archive',
    authJwtMW,
    checkAdminMW,
    updateProblemParamsValidatorMW,
    problemController.archiveProblem,
);

export default router;
