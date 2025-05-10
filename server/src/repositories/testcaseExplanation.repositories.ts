import {
    TestcaseExplanationDataT,
    testcaseExplanationModel,
    TestcaseExplanationT,
} from '../models/testcaseExplanation.model.js';

const createTestcaseExplanation = async (
    data: TestcaseExplanationDataT,
): Promise<TestcaseExplanationT> => {
    const testcaseExplanation = await testcaseExplanationModel.create(data);
    return testcaseExplanation;
};

const updateTestcaseExplanation = async (
    id: string,
    data: TestcaseExplanationDataT,
): Promise<null | TestcaseExplanationT> => {
    const testcaseExplanation = await testcaseExplanationModel.findOneAndUpdate(
        { _id: id },
        data,
        { new: true },
    );
    return testcaseExplanation;
};

const getTestcaseExplanationByTestcaseId = async (
    testcase_id: string,
): Promise<null | TestcaseExplanationT> => {
    const testcaseExplanation = await testcaseExplanationModel.findOne({
        testcase_id,
    });
    return testcaseExplanation;
};
export {
    createTestcaseExplanation,
    getTestcaseExplanationByTestcaseId,
    updateTestcaseExplanation,
};
