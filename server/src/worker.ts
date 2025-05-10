import mongoose from 'mongoose';

async function startWorker() {
    try {
        await mongoose.connect(
            process.env.DATABASE_URL ?? 'mongodb://localhost:27017',
            {
                autoIndex: true,
                dbName: 'OJ_DB',
            },
        );
        await import('./bullmq/workers/submissionWorker.js');
    } catch (err) {
        console.error('Error connecting to MongoDB or starting worker:', err);
        process.exit(1);
    }
}

await startWorker();
