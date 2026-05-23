import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    console.log('Getting authenticated');

    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Invalid or missing authorization header" });
    }

    const token = header.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Invalid Authorization format" });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};


