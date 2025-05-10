import { ObjectId } from 'mongodb';

import {
    TestcaseDataT,
    TestcaseInputT,
    testcaseModel,
    TestcaseT,
} from '../models/testcase.model.js';

const createTestCase = async (data: TestcaseDataT): Promise<TestcaseT> => {
    const testcase = await testcaseModel.create(data);
    return testcase;
};

const updateTestcase = async (
    id: string,
    data: TestcaseInputT,
): Promise<null | TestcaseT> => {
    const updatedTestcase = await testcaseModel
        .findOneAndUpdate({ _id: id }, data, { new: true })
        .populate('explanation')
        .lean();
    return updatedTestcase;
};

const getTestCasesByProblemId = async (
    problem_id: ObjectId,
): Promise<TestcaseT[]> => {
    const testcases = await testcaseModel
        .find({ problem_id })
        .populate('explanation')
        .lean();
    return testcases;
};

const getTestCasesByProblemIdWithoutExplanation = async (
    problem_id: ObjectId,
): Promise<TestcaseT[]> => {
    const testcases = await testcaseModel.find({ problem_id }).lean();
    return testcases;
};

export {
    createTestCase,
    getTestCasesByProblemId,
    getTestCasesByProblemIdWithoutExplanation,
    updateTestcase,
};
