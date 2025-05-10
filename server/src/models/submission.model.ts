import { InferSchemaType, model, Schema, Types } from 'mongoose';

const submissionCollectionName = 'submissions';

const submissionSchema = new Schema(
    {
        code: {
            required: true,
            type: String,
        },
        execution_time: {
            default: null,
            type: Number,
        },
        language: {
            enum: ['python', 'cpp', 'java', 'ruby'],
            required: true,
            type: String,
        },
        memory_used: {
            default: null,
            type: Number,
        },
        problem_id: {
            ref: 'problems',
            required: true,
            type: Schema.Types.ObjectId,
        },
        status: {
            enum: [
                'pending',
                'running',
                'accepted',
                'wrong answer',
                'runtime error',
                'time limit exceeded',
            ],
            required: true,
            type: String,
        },
        submitted_at: {
            default: Date.now,
            type: Date,
        },
        user_id: {
            ref: 'users',
            required: true,
            type: Schema.Types.ObjectId,
        },
    },
    {
        collection: submissionCollectionName,
        timestamps: true,
    },
);

const submissionModel = model(submissionCollectionName, submissionSchema);

type SubmissionDataT = Omit<
    InferSchemaType<typeof submissionSchema>,
    'createdAt' | 'updatedAt'
>;

type SubmissionT = SubmissionDataT & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export {
    submissionCollectionName,
    SubmissionDataT,
    submissionModel,
    SubmissionT,
};
