import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ProblemDataInputT, ProblemDataT } from '../models/problem.model.js';
import * as problemService from '../services/problem.service.js';
import wrapAsync from '../utils/wrapAsync.js';

const createProblem: RequestHandler = wrapAsync(
    async (
        req: Request<unknown, unknown, ProblemDataInputT>,
        res: Response,
    ) => {
        const problem = await problemService.createProblem(req.body);
        res.status(StatusCodes.CREATED).json(problem);
    },
);

const updateProblem: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, ProblemDataT>, res: Response) => {
        const { id } = req.params as { id: string };
        const problem = await problemService.updateProblem(id, req.body);
        res.status(StatusCodes.OK).json(problem);
    },
);

const reviewProblem: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, ProblemDataT>, res: Response) => {
        const { id } = req.params as { id: string };
        const problem = await problemService.reviewProblem(id, req.body);
        res.status(StatusCodes.OK).json(problem);
    },
);

const archiveProblem: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, ProblemDataT>, res: Response) => {
        const { id } = req.params as { id: string };
        const problem = await problemService.archiveProblem(id);
        res.status(StatusCodes.OK).json(problem);
    },
);

const getProblem: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, unknown>, res: Response) => {
        const { id } = req.params as { id: string };
        const problem = await problemService.getProblem(id);
        res.status(StatusCodes.OK).json(problem);
    },
);

const getAllProblems: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, ProblemDataT>, res: Response) => {
        const problems = await problemService.getAllProblems();
        res.status(StatusCodes.OK).json(problems);
    },
);

export {
    archiveProblem,
    createProblem,
    getAllProblems,
    getProblem,
    reviewProblem,
    updateProblem,
};
