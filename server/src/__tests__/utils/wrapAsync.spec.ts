import { NextFunction, Request, Response } from 'express';
import { describe, expect, it, vi } from 'vitest';

import wrapAsync from '../../utils/wrapAsync.js';

describe('wrapAsync', () => {
    it('should call next with error if the handler throws an error', async () => {
        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn() as NextFunction;

        const error = new Error('Test error');
        const handler = vi.fn().mockRejectedValue(error);

        const wrappedHandler = wrapAsync(handler);

        await wrappedHandler(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });

    it('should call the handler with req, res, and next', async () => {
        const req = {} as Request;
        const res = {} as Response;
        const next = vi.fn() as NextFunction;

        const handler = vi.fn().mockResolvedValue(undefined);

        const wrappedHandler = wrapAsync(handler);

        await wrappedHandler(req, res, next);

        expect(handler).toHaveBeenCalledWith(req, res, next);
        expect(next).not.toHaveBeenCalled();
    });
});
