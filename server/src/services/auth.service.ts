import { signToken } from '../lib/jsonwebtoken/index.js';

const login = (userId: string): string => {
    return signToken({ userId });
};

export { login };
