import { z } from 'zod';

export const taskStatusSchema = z.enum(['todo', 'working_on_it', 'done']);

export const createTaskSchema = z.object({
    title: z.string().min(10).max(60),
    description: z.string().min(10).max(1000).optional(),
    board: z.string(),
    assignedTo: z.string(),
    assignedBy: z.string(),
    dueDate: z.string().optional()
});

export const updateTaskSchema = createTaskSchema.extend({
    status: taskStatusSchema
}).partial();

export const updateTaskStatusSchema = z.object({ 
    status: taskStatusSchema
});
