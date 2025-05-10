import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { SubmissionJobData } from '../bullmq/interface/submissionJobData.interface.js';
import { submissionQueue } from '../bullmq/queues/submissionQueue.js';
import { SubmissionDataT } from '../models/submission.model.js';
import * as submissionService from '../services/submission.service.js';
import wrapAsync from '../utils/wrapAsync.js';

const getAllSubmissions: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, SubmissionDataT>, res: Response) => {
        const submissions = await submissionService.getAllSubmissions();
        res.status(StatusCodes.OK).json(submissions);
    },
);

const createSubmission: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, SubmissionDataT>, res: Response) => {
        const submission = await submissionService.createSubmission(req.body);
        const jobData: SubmissionJobData = {
            submissionId: submission._id.toString(),
        };
        await submissionQueue.add('evaluateSubmission', jobData);

        res.status(StatusCodes.CREATED).json(submission);
    },
);

export { createSubmission, getAllSubmissions };
