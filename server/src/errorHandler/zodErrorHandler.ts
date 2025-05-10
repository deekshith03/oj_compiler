import { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ZodError, ZodIssue } from 'zod';

const zodErrorHandler: ErrorRequestHandler = (
    error: unknown,
    _req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: ZodIssue) => ({
            message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res.status(StatusCodes.BAD_REQUEST).json({
            details: errorMessages,
            message: ReasonPhrases.BAD_REQUEST,
        });
        return;
    }
    next(error);
};

export default zodErrorHandler;
