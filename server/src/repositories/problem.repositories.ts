import { StatusCodes } from 'http-status-codes';

import { AppError } from '../errorHandler/error.interface.js';
import {
    ProblemDataT,
    problemModel,
    ProblemT,
} from '../models/problem.model.js';

const createProblem = async (data: ProblemDataT): Promise<ProblemT> => {
    const problem = await problemModel.create(data);
    return problem;
};

const updateProblem = async (
    id: string,
    data: ProblemDataT,
): Promise<null | ProblemT> => {
    const problem = await problemModel.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    return problem;
};

const reviewProblem = async (
    id: string,
    data: ProblemDataT,
): Promise<null | ProblemT> => {
    const reviewed_problem = await problemModel.findOneAndUpdate(
        { _id: id, status: { $nin: ['approved', 'archived'] } },
        data,
        { new: true },
    );

    if (!reviewed_problem) {
        throw new AppError({
            errorMessageForClient: 'Problem not found or already reviewed',
            messageForSentry: 'Problem not found or already reviewed',
            statusCode: StatusCodes.BAD_REQUEST,
        });
    }

    return reviewed_problem;
};

const archiveProblem = async (id: string): Promise<null | ProblemT> => {
    const problem = await problemModel.findOneAndUpdate(
        { _id: id, status: { $ne: 'archived' } },
        { status: 'archived' },
        { new: true },
    );

    if (!problem) {
        throw new AppError({
            errorMessageForClient: 'Problem is already archived or not found',
            messageForSentry:
                'Attempted to archive an already archived problem or invalid ID',
            statusCode: StatusCodes.BAD_REQUEST,
        });
    }

    return problem;
};

const getProblem = async (id: string): Promise<null | ProblemT> => {
    const problem = await problemModel.findOne({ _id: id }).lean();
    return problem;
};

const getAllProblems = async (): Promise<null | ProblemT[]> => {
    const problems = await problemModel.find().lean();
    return problems;
};

export {
    archiveProblem,
    createProblem,
    getAllProblems,
    getProblem,
    reviewProblem,
    updateProblem,
};
