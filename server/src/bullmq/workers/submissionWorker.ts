import { Worker, WorkerOptions } from 'bullmq';
import Docker from 'dockerode';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';

import { AppError } from '../../errorHandler/error.interface.js';
import { SubmissionT } from '../../models/submission.model.js';
import { TestcaseT } from '../../models/testcase.model.js';
import * as submissionDb from '../../repositories/submission.repositories.js';
import { getTestCasesByProblemIdWithoutExplanation } from '../../repositories/testcase.repositories.js';
import { createTarBuffer } from '../../utils/createTarBuffer.js';
import {
    languageDockerFileMapping,
    languageExtensionMapping,
} from '../../utils/languageMapping.js';
import { bullmqConnection } from '../index.js';
import { SubmissionJobData } from '../interface/submissionJobData.interface.js';

const workerOptions: WorkerOptions = { connection: bullmqConnection };
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const worker = new Worker<SubmissionJobData>(
    'submissionQueue',
    async (job) => {
        try {
            const submission = await fetchSubmission(job.data.submissionId);
            console.log('Submission fetched:', submission);
            const testCases = await fetchTestCases(submission.problem_id);
            const tarBuffer = await buildTarball(submission, testCases);
            const container = await runDockerContainer(
                submission.language,
                tarBuffer,
                getSubmissionFileName(submission.language),
            );
            const containerLogOutput = await getContainerLogs(container);
            const sanitizedLogs = santizeContainerLogs(containerLogOutput);
            await evaluateTestCases(sanitizedLogs, testCases, submission);
            console.log('sanitizedLogs:', sanitizedLogs);

            await container.wait();
        } catch (error) {
            console.error('Error evaluating submission:', error);
            throw new AppError({
                errorMessageForClient: ReasonPhrases.INTERNAL_SERVER_ERROR,
                messageForSentry: 'Submission evaluation failed',
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            });
        }
    },
    workerOptions,
);

worker.on('completed', () => {
    console.log(`Job completed successfully.`);
});
worker.on('failed', (job, err) => {
    console.error(`Job failed to process: ${err.message}`);
});

async function buildTarball(submission: SubmissionT, testCases: TestcaseT[]) {
    const submissionFileName = getSubmissionFileName(submission.language);
    return await createTarBuffer({
        'input.txt': testCases.map((tc) => tc.input).join('\n'),
        [submissionFileName]: submission.code,
    });
}

async function evaluateTestCases(
    sanitizedLogs: string,
    testCases: TestcaseT[],
    submission: SubmissionT,
) {
    const sanitizedLogsArray = sanitizedLogs.split('\n');

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const output = sanitizedLogsArray[i]?.trim() ?? '';
        const expectedOutput = testCase.expected_output.trim();

        if (output !== expectedOutput) {
            await submissionDb.updateSubmission(submission._id.toString(), {
                ...submission,
                status: 'wrong answer',
            });
            return;
        }
    }
    await submissionDb.updateSubmission(submission._id.toString(), {
        ...submission,
        status: 'accepted',
    });
}

async function fetchSubmission(submissionId: string) {
    const submission = await submissionDb.getSubmission(submissionId);
    if (!submission) {
        throw new AppError({
            errorMessageForClient: ReasonPhrases.NOT_FOUND,
            messageForSentry: 'Submission not found',
            statusCode: StatusCodes.NOT_FOUND,
        });
    }
    return submission;
}

async function fetchTestCases(problemId: ObjectId) {
    return await getTestCasesByProblemIdWithoutExplanation(problemId);
}

async function getContainerLogs(container: Docker.Container): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let output = '';
        container
            .logs({ follow: true, stderr: true, stdout: true })
            .then((logStream) => {
                logStream.on('data', (chunk: Buffer) => {
                    output += chunk.toString('utf8');
                });

                logStream.on('end', () => {
                    console.log('Container logs stream ended.');
                    resolve(output);
                });

                logStream.on('error', (err) => {
                    console.error('Error reading container logs:', err);
                    if (err instanceof Error) {
                        reject(err);
                    } else {
                        reject(
                            new Error(
                                `Log stream encountered an error: ${String(err)}`,
                            ),
                        );
                    }
                });
            })
            .catch((err: unknown) => {
                console.error('Error initiating log stream:', err);
                if (err instanceof Error) {
                    reject(err);
                } else {
                    reject(
                        new Error(
                            `Failed to initiate log stream: ${String(err)}`,
                        ),
                    );
                }
            });
    });
}

function getSubmissionFileName(
    language: keyof typeof languageExtensionMapping,
): string {
    return `main.${languageExtensionMapping[language]}`;
}

async function runDockerContainer(
    language: keyof typeof languageDockerFileMapping,
    tarBuffer: Buffer,
    submissionFileName: string,
) {
    const image = languageDockerFileMapping[language];

    const container = await docker.createContainer({
        Env: [`SUBMISSION_FILE=${submissionFileName}`],
        HostConfig: {
            AutoRemove: true,
            Memory: 256 * 1024 * 1024,
            NanoCpus: 500_000_000,
            NetworkMode: 'none',
        },
        Image: image,
    });

    await container.start();
    await container.putArchive(tarBuffer, { path: '/usr/src/app' });

    return container;
}

const santizeContainerLogs = (logs: string): string => {
    const marker = 'Running executable...';
    const parts = logs.split(marker);
    if (parts.length < 2) return '';
    return parts[1].trim();
};
