import { z } from 'zod';

export const departmentSchema = z.enum(['HR', 'IT', 'Sales', 'Marketing', 'Finance', 'Production']);
    
export const positionSchema = z.enum(['HR Manager',
    'Developer',
    'Analyst',
    'Product Manager',
    'Accountant',
    'Technician',
    'Sales Manager',
    'Office Administrator',
    'Designer',
    'Project Manager',
    'Intern']);

export const createUserSchema = z.object({
    username: z.string().min(3).optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    email: z.string().email(),
    role: z.string(),
    department: departmentSchema.optional(),
    position: positionSchema.optional(),
})

export const updateUserSchema = createUserSchema.partial();



