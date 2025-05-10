import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { AppError } from '../errorHandler/error.interface.js';
import {
    ProblemDataInputT,
    ProblemDataT,
    ProblemT,
} from '../models/problem.model.js';
import { TestcaseExplanationDataT } from '../models/testcaseExplanation.model.js';
import * as problemDb from '../repositories/problem.repositories.js';
import * as testcaseDb from '../repositories/testcase.repositories.js';
import * as testCaseExplanationDb from '../repositories/testcaseExplanation.repositories.js';

const createProblem = async (data: ProblemDataInputT): Promise<ProblemT> => {
    const { testcases, ...problemData } = data;
    const problem = await problemDb.createProblem(problemData);

    if (testcases && testcases.length > 0) {
        for (const testcaseInput of testcases) {
            const { explanation, ...testcaseData } = testcaseInput;
            const createdTestCase = await testcaseDb.createTestCase({
                ...testcaseData,
                problem_id: problem._id,
            });
            if (explanation) {
                const explanationData: TestcaseExplanationDataT = {
                    explanation: explanation,
                    testcase_id: createdTestCase._id,
                };
                await testCaseExplanationDb.createTestcaseExplanation(
                    explanationData,
                );
            }
        }
    }
    return problem;
};

const updateProblem = async (
    id: string,
    data: ProblemDataT,
): Promise<null | ProblemT> => {
    if (!id) {
        throw new AppError({
            errorMessageForClient: ReasonPhrases.BAD_REQUEST,
            messageForSentry: 'id not found',
            statusCode: StatusCodes.BAD_REQUEST,
        });
    }

    const problem = await problemDb.updateProblem(id, data);
    return problem;
};

const reviewProblem = async (
    id: string,
    data: ProblemDataT,
): Promise<null | ProblemT> => {
    const problem = await problemDb.reviewProblem(id, data);
    return problem;
};

const archiveProblem = async (id: string): Promise<null | ProblemT> => {
    const problem = await problemDb.archiveProblem(id);
    return problem;
};

const getProblem = async (id: string) => {
    const problem = await problemDb.getProblem(id);
    if (!problem) return;
    const testcases = await testcaseDb.getTestCasesByProblemId(problem._id);
    return {
        ...problem,
        testcases: testcases,
    };
};

const getAllProblems = async (): Promise<null | ProblemT[]> => {
    const problems = await problemDb.getAllProblems();
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
