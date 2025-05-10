import bcrypt from 'bcrypt';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { AppError } from '../../errorHandler/error.interface.js';
const saltRounds = 10;

const hashPassword = async (password: string): Promise<string> => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw new AppError({
            errorMessageForClient: ReasonPhrases.INTERNAL_SERVER_ERROR,
            messageForSentry: 'Password hashing failed',
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
};

const checkPassword = async ({
    hash,
    password,
}: {
    hash: string;
    password: string;
}): Promise<void> => {
    const result = await bcrypt.compare(password, hash);
    if (!result) {
        throw new AppError({
            errorMessageForClient: ReasonPhrases.NOT_FOUND,
            messageForSentry: 'Password incorrect',
            statusCode: StatusCodes.NOT_FOUND,
        });
    }
};

export { checkPassword, hashPassword };
