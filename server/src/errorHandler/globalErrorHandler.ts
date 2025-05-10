import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { AppError } from './error.interface.js';

const globalErrorHandler: ErrorRequestHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
): void => {
    if (err instanceof AppError) {
        console.log('app error', err.message);
        res.status(err.statusCode).json({
            message: err.errorMessageForClient,
        });
        return;
    }

    if (err instanceof Error) {
        console.log('unhandled error', err.message);
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });

    return;
};

export default globalErrorHandler;
