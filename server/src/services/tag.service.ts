import { TagDataT, tagModel, TagT } from '../models/tag.model.js';

const getAllTags = async (): Promise<null | TagT[]> => {
    const tags = await tagModel.find();
    return tags;
};

const createTag = async (data: TagDataT): Promise<TagT> => {
    const tag = await tagModel.create(data);
    return tag;
};

export { createTag, getAllTags };
