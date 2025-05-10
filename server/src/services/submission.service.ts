import { SubmissionDataT, SubmissionT } from '../models/submission.model.js';
import * as submissionDb from '../repositories/submission.repositories.js';

const createSubmission = async (
    data: SubmissionDataT,
): Promise<SubmissionT> => {
    const submission = await submissionDb.createSubmission(data);
    return submission;
};

const getAllSubmissions = async (): Promise<null | SubmissionT[]> => {
    const submissions = await submissionDb.getAllSubmissions();
    return submissions;
};

export { createSubmission, getAllSubmissions };
