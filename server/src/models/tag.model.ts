import { InferSchemaType, model, Schema, Types } from 'mongoose';

const tagCollectionName = 'tags';

const tagSchema = new Schema(
    {
        name: {
            required: true,
            type: String,
            unique: true,
        },
    },
    {
        collection: tagCollectionName,
        timestamps: true,
    },
);

const tagModel = model(tagCollectionName, tagSchema);

type TagDataT = Omit<
    InferSchemaType<typeof tagSchema>,
    'createdAt' | 'updatedAt'
>;

type TagT = TagDataT & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export { tagCollectionName, TagDataT, tagModel, TagT };
