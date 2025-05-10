import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodObject, ZodRawShape } from 'zod';

type ValidateOn = 'body' | 'params' | 'query';

const validatorMW =
    <T extends ZodRawShape>({
        validateOn,
        validator,
    }: {
        validateOn: ValidateOn;
        validator: ZodObject<T>;
    }): RequestHandler =>
    (req: Request, res: Response, next: NextFunction) => {
        const data = validator.parse(req[validateOn]);
        req[validateOn] = data;
        next();
    };

export { ValidateOn, validatorMW };
