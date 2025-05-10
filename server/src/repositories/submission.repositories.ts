import {
    SubmissionDataT,
    submissionModel,
    SubmissionT,
} from '../models/submission.model.js';

const createSubmission = async (
    data: SubmissionDataT,
): Promise<SubmissionT> => {
    const submission = await submissionModel.create(data);
    return submission;
};

const updateSubmission = async (
    id: string,
    data: SubmissionDataT,
): Promise<null | SubmissionT> => {
    const submission = await submissionModel.findOneAndUpdate(
        { _id: id },
        data,
        { new: true },
    );
    return submission;
};

const getSubmission = async (id: string): Promise<null | SubmissionT> => {
    const submission = await submissionModel.findById(id);
    return submission;
};

const getAllSubmissions = async (): Promise<null | SubmissionT[]> => {
    const submissions = await submissionModel.find().lean();
    return submissions;
};

export { createSubmission, getAllSubmissions, getSubmission, updateSubmission };
