/* eslint-disable perfectionist/sort-modules */
import { InferSchemaType, model, Schema, Types } from 'mongoose';

import { TestcaseInputT } from './testcase.model.js';

const problemCollectionName = 'problems';

const problemSchema = new Schema(
    {
        constraints: {
            required: false,
            type: [String],
        },
        created_by: {
            ref: 'users',
            required: true,
            type: Schema.Types.ObjectId,
        },
        description: {
            required: true,
            type: String,
        },
        difficulty: {
            enum: ['easy', 'medium', 'hard'],
            required: true,
            type: String,
        },
        reviewed_by: {
            ref: 'users',
            required: false,
            type: Schema.Types.ObjectId,
        },
        status: {
            enum: ['pending', 'approved', 'rejected', 'archived'],
            required: true,
            type: String,
        },
        tags: {
            ref: 'tags',
            required: false,
            type: [Schema.Types.ObjectId],
        },
        title: {
            required: true,
            type: String,
        },
    },
    {
        collection: problemCollectionName,
        timestamps: true,
    },
);

problemSchema.index(
    { title: 1 },
    {
        name: 'title_unique_non_archived',
        partialFilterExpression: { status: { $in: ['pending', 'approved'] } },
        unique: true,
    },
);

const problemModel = model(problemCollectionName, problemSchema);

type ProblemDataT = Omit<
    InferSchemaType<typeof problemSchema>,
    'createdAt' | 'updatedAt'
>;

type ProblemT = ProblemDataT & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

type ProblemDataInputT = ProblemDataT & {
    testcases?: TestcaseInputT[];
};

export {
    problemCollectionName,
    ProblemDataInputT,
    ProblemDataT,
    problemModel,
    ProblemT,
};
