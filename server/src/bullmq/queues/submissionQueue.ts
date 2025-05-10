import { Queue, QueueOptions } from 'bullmq';

import { bullmqConnection } from '../index.js';
import { SubmissionJobData } from '../interface/submissionJobData.interface.js';

const queueOptions: QueueOptions = { connection: bullmqConnection };

export const submissionQueue = new Queue<SubmissionJobData>(
    'submissionQueue',
    queueOptions,
);

submissionQueue.on('waiting', () => {
    console.log(`Job added`);
});
