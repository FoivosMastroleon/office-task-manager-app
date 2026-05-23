import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';  // I Tried to import ZodSchema but it mentioned that as deprecated, so i used ZodType


export const validate = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = schema.parse(req.body);
                next();
        
            }
            catch (err: any) {
                return res.status(400).json({message: err?.errors || 'Validation error' });
    }
    }
}