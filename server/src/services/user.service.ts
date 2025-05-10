import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { AppError } from '../errorHandler/error.interface.js';
import { hashPassword } from '../lib/bycrypt/index.js';
import { UserDataT, UserT } from '../models/user.model.js';
import * as userDb from '../repositories/user.repositories.js';

const getUserByEmail = async ({ email }: { email: string }): Promise<UserT> => {
    const user = await userDb.getUserByEmail({ email });
    if (!user) {
        throw new AppError({
            errorMessageForClient: ReasonPhrases.NOT_FOUND,
            messageForSentry: 'email not found for getUser',
            statusCode: StatusCodes.NOT_FOUND,
        });
    }
    return user;
};

const getUserById = async ({ userId }: { userId: string }): Promise<UserT> => {
    const user = await userDb.getUserById({ userId });
    if (!user) {
        throw new AppError({
            errorMessageForClient: ReasonPhrases.NOT_FOUND,
            messageForSentry: 'User not found from userId',
            statusCode: StatusCodes.NOT_FOUND,
        });
    }
    return user;
};

const getAllUsers = async (): Promise<UserT[]> => {
    const users = await userDb.getAllUsers();
    return users;
};

const createUser = async ({
    email,
    name,
    password,
    role,
}: UserDataT): Promise<UserT> => {
    const hashedPassword = await hashPassword(password);
    return userDb.createUser({ email, name, password: hashedPassword, role });
};

export { createUser, getAllUsers, getUserByEmail, getUserById };
