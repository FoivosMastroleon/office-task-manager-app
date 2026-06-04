import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(`[ERROR] ${req.method} ${req.path}`, err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Validation error', details: err.message });
    }

    // Mongoose invalid ObjectId
    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    // MongoDB duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] ?? 'field';
        return res.status(409).json({ message: `Duplicate value for ${field}` });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const status = err.status || err.statusCode || 500;
    const message = status < 500 ? err.message : 'Internal server error';
    res.status(status).json({ message });
};
