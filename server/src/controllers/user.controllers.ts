import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UserDataT } from '../models/user.model.js';
import * as userService from '../services/user.service.js';
import wrapAsync from '../utils/wrapAsync.js';

const createUser: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, UserDataT>, res: Response) => {
        console.log(req.body);
        const { email, name, password, role } = req.body;
        const user = await userService.createUser({
            email,
            name,
            password,
            role,
        });
        res.status(StatusCodes.CREATED).json(user);
    },
);

const getAllUsers: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, UserDataT>, res: Response) => {
        const users = await userService.getAllUsers();
        res.status(StatusCodes.OK).json(users);
    },
);

const getUser: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, UserDataT>, res: Response) => {
        const { id } = req.params as { id: string };
        const user = await userService.getUserById({ userId: id });
        res.status(StatusCodes.OK).json(user);
    },
);

export { createUser, getAllUsers, getUser };
