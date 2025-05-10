import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

import { corsList } from './constants.js';
import globalErrorHandler from './errorHandler/globalErrorHandler.js';
import zodErrorHandler from './errorHandler/zodErrorHandler.js';
import authRouter from './routes/auth.routes.js';
import problemRouter from './routes/problem.routes.js';
import submissionRouter from './routes/submission.routes.js';
import tagRouter from './routes/tag.routes.js';
import testcaseRouter from './routes/testcase.routes.js';
import userRouter from './routes/user.routes.js';

const app: Express = express();
const port = process.env.PORT ?? 3000;
export const database_url =
    process.env.DATABASE_URL ?? 'mongodb://localhost:27017';

await mongoose.connect(database_url, {
    autoIndex: true,
    dbName: 'OJ_DB',
});

app.use(
    cors({
        methods: ['GET', 'POST'],
        origin: corsList,
    }),
);

app.use(
    bodyParser.json({
        limit: '10mb',
    }),
);

app.use(passport.initialize());

app.use('/users', userRouter);

app.use('/auth', authRouter);

app.use('/tags', tagRouter);

app.use('/problems', problemRouter);

app.use('/submissions', submissionRouter);

app.use('/testcases', testcaseRouter);

app.use(zodErrorHandler);

app.use(globalErrorHandler);

app.listen(port, () => {
    console.log(`Server running on PORT: ${port.toString()}`);
});
