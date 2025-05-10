import { InferSchemaType, model, Schema, Types } from 'mongoose';

const testcaseCollectionName = 'testcases';

const testcaseSchema = new Schema(
    {
        expected_output: {
            required: true,
            type: String,
        },
        input: {
            required: false,
            type: String,
        },
        is_sample: {
            default: false,
            type: Boolean,
        },
        problem_id: {
            ref: 'problems',
            required: true,
            type: Schema.Types.ObjectId,
        },
    },
    {
        collection: testcaseCollectionName,
        timestamps: true,
    },
);

testcaseSchema.virtual('explanation', {
    foreignField: 'testcase_id',
    justOne: true,
    localField: '_id',
    ref: 'testcase_explanations',
});

testcaseSchema.set('toObject', { virtuals: true });
testcaseSchema.set('toJSON', { virtuals: true });

const testcaseModel = model(testcaseCollectionName, testcaseSchema);

type TestcaseDataT = Omit<
    InferSchemaType<typeof testcaseSchema>,
    'createdAt' | 'updatedAt'
>;

type TestcaseInputT = Omit<TestcaseDataT, 'problem_id'> & {
    explanation?: string;
};

type TestcaseT = TestcaseDataT & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export {
    testcaseCollectionName,
    TestcaseDataT,
    TestcaseInputT,
    testcaseModel,
    TestcaseT,
};
