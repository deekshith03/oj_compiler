import { NextFunction, Request, Response } from 'express';

const checkAdminMW = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin) {
        res.status(403).json({ message: 'Forbidden: Admins only' });
        return;
    }
    next();
};

export default checkAdminMW;
