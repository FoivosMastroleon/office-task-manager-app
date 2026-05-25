import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.findUsers();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid id' });
        const user = await userService.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export const getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.params.email;
        if (typeof email !== 'string') return res.status(400).json({ message: 'Invalid email' });
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export const getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.params.username;
        if (typeof username !== 'string') return res.status(400).json({ message: 'Invalid username' });
        const user = await userService.findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload: CreateUserDTO = req.body;
        const user = await userService.createUser(payload);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid id' });
        const payload: UpdateUserDTO = req.body;
        const user = await userService.updateUser(id, payload);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

export const softDelete = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid id' });
        const result = await userService.softDeleteUser(id);
        if (!result) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}