import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import * as authService from '../services/auth.service.js';

const login: RequestHandler = (req: Request, res: Response) => {
    const { user } = req as { user?: { _id: string } };
    if (!user?._id) {
        res.status(StatusCodes.BAD_REQUEST).json({
            error: 'Invalid user data',
        });
        return;
    }
    const token = authService.login(user._id);
    res.status(StatusCodes.CREATED).json({ token });
};

export { login };
