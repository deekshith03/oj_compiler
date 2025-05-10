import z from 'zod';

const objectIdSchema = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

const createProblemValidator = z.object({
    constraints: z.array(z.string()).optional(),
    created_by: objectIdSchema,
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters long'),
    difficulty: z.enum(['easy', 'medium', 'hard'], {
        errorMap: () => ({
            message: 'Difficulty must be one of easy, medium, or hard',
        }),
    }),
    status: z.string().refine((value) => {
        return value === 'pending';
    }),
    tags: z.array(objectIdSchema).max(6, 'Maximum 6 tags allowed').optional(),
    testcases: z.array(
        z.object({
            expected_output: z.string(),
            explanation: z.string().optional(),
            input: z.string().optional(),
            is_sample: z.boolean().optional(),
        }),
    ),
    title: z.string().min(5, 'Title must be at least 5 characters long'),
});

const updateProblemValidator = z.object({
    constraints: z.array(z.string()).optional(),
    created_by: objectIdSchema.optional(),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters long')
        .optional(),
    difficulty: z
        .enum(['easy', 'medium', 'hard'], {
            errorMap: () => ({
                message: 'Difficulty must be one of easy, medium, or hard',
            }),
        })
        .optional(),
    tags: z.array(objectIdSchema).max(6, 'Maximum 6 tags allowed').optional(),
    title: z
        .string()
        .min(5, 'Title must be at least 5 characters long')
        .optional(),
});

const reviewProblemValidator = z.object({
    reviewed_by: objectIdSchema,
    status: z.enum(['approved', 'rejected'], {
        errorMap: () => ({
            message: 'Status must be one of approved or rejected',
        }),
    }),
});

const updateProblemParamsValidator = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format'),
});

export {
    createProblemValidator,
    reviewProblemValidator,
    updateProblemParamsValidator,
    updateProblemValidator,
};
