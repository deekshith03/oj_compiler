import { NextFunction, Request, RequestHandler, Response } from 'express';

const catchAsync =
    (requestHandler: RequestHandler): RequestHandler =>
    async (req: Request, res: Response, next: NextFunction) =>
        (requestHandler(req, res, next) as Promise<void>).catch(
            (error: unknown) => {
                next(error);
            },
        );

export default catchAsync;
