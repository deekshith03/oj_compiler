import z from 'zod';

const createUserValidator = z.object({
    email: z.string().email(),
    name: z.string().min(3),
    password: z.string().min(6),
    role: z.enum(['admin', 'user']),
});

const searchUsersValidator = z.object({
    query: z.string().min(3),
});

export { createUserValidator, searchUsersValidator };
