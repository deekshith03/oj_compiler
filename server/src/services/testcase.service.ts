import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import mongoose, { Types } from 'mongoose';

import { AppError } from '../errorHandler/error.interface.js';
import { TestcaseInputT, TestcaseT } from '../models/testcase.model.js';
import * as testcaseDb from '../repositories/testcase.repositories.js';
import * as testcaseExplanationDb from '../repositories/testcaseExplanation.repositories.js';

const updateTestcase = async (
    id: string,
    data: TestcaseInputT,
): Promise<TestcaseT> => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        if (data.explanation) {
            const testcaseExplanation =
                await testcaseExplanationDb.getTestcaseExplanationByTestcaseId(
                    id,
                );
            if (testcaseExplanation) {
                await testcaseExplanationDb.updateTestcaseExplanation(
                    testcaseExplanation._id.toString(),
                    {
                        explanation: data.explanation,
                        testcase_id: new Types.ObjectId(id),
                    },
                );
            } else {
                const explanationData = {
                    explanation: data.explanation,
                    testcase_id: new Types.ObjectId(id),
                };
                await testcaseExplanationDb.createTestcaseExplanation(
                    explanationData,
                );
            }
        }

        const updatedTestcase = await testcaseDb.updateTestcase(id, data);
        if (!updatedTestcase) {
            throw new AppError({
                errorMessageForClient: ReasonPhrases.NOT_FOUND,
                messageForSentry: 'Testcase not found',
                statusCode: StatusCodes.NOT_FOUND,
            });
        }

        await session.commitTransaction();
        await session.endSession();
        return updatedTestcase;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        console.error('Error evaluating submission:', error);
        throw new AppError({
            errorMessageForClient: ReasonPhrases.INTERNAL_SERVER_ERROR,
            messageForSentry: 'Transaction failed',
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        });
    }
};

export { updateTestcase };
