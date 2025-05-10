import { Request, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { TagDataT } from '../models/tag.model.js';
import * as tagService from '../services/tag.service.js';
import wrapAsync from '../utils/wrapAsync.js';

const getAllTags: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, TagDataT>, res: Response) => {
        const tags = await tagService.getAllTags();
        res.status(StatusCodes.OK).json(tags);
    },
);

const createTag: RequestHandler = wrapAsync(
    async (req: Request<unknown, unknown, TagDataT>, res: Response) => {
        const tag = await tagService.createTag(req.body);
        res.status(StatusCodes.CREATED).json(tag);
    },
);

export { createTag, getAllTags };
