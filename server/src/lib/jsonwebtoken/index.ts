import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { AppError } from '../../errorHandler/error.interface.js';

const signToken = (payload: Record<string, string>): string => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new AppError({
            errorMessageForClient: ReasonPhrases.INTERNAL_SERVER_ERROR,
            messageForSentry: 'jwt secret not defined',
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '3600s' });
    return token;
};

export { signToken };
