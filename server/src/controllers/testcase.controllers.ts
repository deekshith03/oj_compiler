import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { TestcaseInputT } from '../models/testcase.model.js';
import * as testCaseService from '../services/testcase.service.js';
import wrapAsync from '../utils/wrapAsync.js';

const updateTestcase: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, TestcaseInputT>, res: Response) => {
        const { id } = req.params as { id: string };
        const testCase = await testCaseService.updateTestcase(id, req.body);
        res.status(StatusCodes.OK).json(testCase);
    },
);

export { updateTestcase };
