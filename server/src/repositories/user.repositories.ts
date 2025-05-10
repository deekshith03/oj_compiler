import { UserDataT, userModel, UserT } from '../models/user.model.js';

const getUserByEmail = async ({
    email,
}: {
    email: string;
}): Promise<null | UserT> => {
    const user = await userModel.findOne({ email }).lean();
    return user;
};

const getUserById = async ({
    userId,
}: {
    userId: string;
}): Promise<null | UserT> => {
    const user = await userModel.findOne({ _id: userId }).lean();
    return user;
};

const createUser = async (userData: UserDataT): Promise<UserT> => {
    const user = await userModel.create(userData);
    return user;
};

const getAllUsers = async (): Promise<UserT[]> => {
    const users = await userModel.find().lean();
    return users;
};

export { createUser, getAllUsers, getUserByEmail, getUserById };
