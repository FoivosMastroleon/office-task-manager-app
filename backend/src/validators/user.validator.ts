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
    username: z.string().min(3),
    password: z.string().min(6),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    email: z.string().optional(),
    role: z.string(),
    department: departmentSchema.optional(),
    position: positionSchema.optional(),


})

export const updateUserSchema = createUserSchema.partial();



