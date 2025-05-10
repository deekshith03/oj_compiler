import { InferSchemaType, model, Schema, Types } from 'mongoose';

const userCollectionName = 'users';

const userSchema = new Schema(
    {
        email: {
            required: true,
            type: String,
            unique: true,
        },
        name: {
            required: true,
            type: String,
        },
        password: {
            required: true,
            type: String,
        },
        role: {
            enum: ['admin', 'user'],
            required: true,
            type: String,
        },
    },
    {
        collection: userCollectionName,
        timestamps: true,
    },
);

const userModel = model(userCollectionName, userSchema);

type UserDataT = Omit<
    InferSchemaType<typeof userSchema>,
    'createdAt' | 'updatedAt'
>;

type UserT = UserDataT & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

export { userCollectionName, UserDataT, userModel, UserT };
