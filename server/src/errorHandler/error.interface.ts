import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
    errorMessageForClient: string;
    statusCode: StatusCodes;

    constructor({
        errorMessageForClient,
        messageForSentry,
        statusCode,
    }: {
        errorMessageForClient: string;
        messageForSentry: string;
        statusCode: number;
    }) {
        super(messageForSentry);
        this.statusCode = statusCode;
        this.errorMessageForClient = errorMessageForClient;
        Error.captureStackTrace(this, this.constructor);
    }
}
