import { InferSchemaType, model, Schema, Types } from 'mongoose';

const testcaseExplanationCollectionName = 'testcase_explanations';

const testcaseExplanationSchema = new Schema(
    {
        explanation: {
            required: true,
            type: String,
        },
        testcase_id: {
            ref: 'testcases',
            required: true,
            type: Schema.Types.ObjectId,
        },
    },
    {
        collection: testcaseExplanationCollectionName,
        timestamps: true,
    },
);

const testcaseExplanationModel = model(
    testcaseExplanationCollectionName,
    testcaseExplanationSchema,
);

type TestcaseExplanationDataT = Omit<
    InferSchemaType<typeof testcaseExplanationSchema>,
    'createdAt' | 'updatedAt'
>;

type TestcaseExplanationT = TestcaseExplanationDataT & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export {
    testcaseExplanationCollectionName,
    TestcaseExplanationDataT,
    testcaseExplanationModel,
    TestcaseExplanationT,
};
