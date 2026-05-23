import { Request, Response, NextFunction } from 'express';

export const hasAdminRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role !== 'admin') {
                return res.status(403).json({ message: "Access denied. Admin role required." });
        }

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const hasManagerRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role !== 'manager') {
            return res.status(403).json({ message: "Access denied. Manager role required." });
        }
        next();
    
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const hasEmployeeRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role !== 'employee') {
            return res.status(403).json({ message: "Access denied. Employee role required." });
        } 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }

};

export const hasAdminOrManagerRole = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role !== 'admin' && req.user.role !== 'manager') {
            return res.status(403).json({ message: "Access denied. Admin or Manager role required." });
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

    