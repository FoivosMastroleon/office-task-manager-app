import { z } from 'zod';

export const createBoardSchema = z.object({
    title: z.string().min(8).max(50),
    description: z.string().min(10).max(500).optional(),
    members: z.array(z.string()).optional(),



})

export const updateBoardSchema = createBoardSchema.partial();