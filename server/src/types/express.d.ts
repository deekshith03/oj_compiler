import 'express';

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }

        interface User {
            role: string;
        }
    }
}
