import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authService.register(req.body);
        res.status(201).json({ status: true, data: user });
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        if (!result) return res.status(401).json({ message: 'Invalid credentials' });
        res.status(200).json({ token: result.token, user: { username: result.user.username } });
    } catch (err) {
        next(err);
    }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.body;
        const result = await authService.googleLogin(token);
        if (!result.status) return res.status(401).json({ status: false, message: result.message });
        res.status(200).json({ status: true, token: result.token });
    } catch (err) {
        next(err);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });
        const user = await authService.getMe(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};
