import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';
import { CreateTaskDTO, UpdateTaskDTO } from '../dto/task.dto';
import { mapTaskToResponse } from '../mappers/task.mapper';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, role } = req.user;
        const tasks = await taskService.findAll(userId, role);
        res.status(200).json(tasks.map(mapTaskToResponse));
    } catch (error) {
        next(error);
    }
};

export const getTasksIncludingInactive = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await taskService.findAllIncludingInactive();
        res.status(200).json(tasks.map(mapTaskToResponse));
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { userId, role } = req.user;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Task id' });
        const task = await taskService.findById(id, userId, role);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(mapTaskToResponse(task));
    } catch (error) {
        next(error);
    }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload: CreateTaskDTO = req.body;
        const task = await taskService.createTask(payload);
        res.status(201).json(mapTaskToResponse(task));
    } catch (error) {
        next(error);
    }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Task id' });
        const payload: UpdateTaskDTO = req.body;
        const updatedTask = await taskService.updateTask(id, payload);
        res.status(200).json(mapTaskToResponse(updatedTask));
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Task id' });
        const deletedTask = await taskService.softDeleteTask(id);
        res.status(200).json(mapTaskToResponse(deletedTask));
    } catch (error) {
        next(error);
    }
};  

export const restoreTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Task id' });
        const restoredTask = await taskService.restoreTask(id);
        res.status(200).json(mapTaskToResponse(restoredTask));
    } catch (error) {
        next(error);
    }
};

export const getTasksByBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.boardId;
        const { userId, role } = req.user;
        if (typeof boardId !== 'string') return res.status(400).json({ message: 'Invalid Board id' });
        const tasks = await taskService.findByBoard(boardId, userId, role);
        if (tasks === null) return res.status(403).json({ message: 'Access denied' });
        res.status(200).json(tasks.map(mapTaskToResponse));
    } catch (error) {
        next(error);
    }
};


export const getTasksByAssignee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId: requestingUserId, role } = req.user;
        const requestedUserId = req.params.userId;
        if (typeof requestedUserId !== 'string') return res.status(400).json({ message: 'Invalid User id' });
        if (role === 'employee' && requestedUserId !== requestingUserId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const tasks = await taskService.findByAssignee(requestedUserId);
        res.status(200).json(tasks.map(mapTaskToResponse));
    } catch (error) {
        next(error);
    }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const { userId, role } = req.user;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Task id' });
        if (role === 'employee') {
            const task = await taskService.findById(id, userId, role);
            if (!task) return res.status(404).json({ message: 'Task not found' });
        }
        const status = req.body.status;
        const updatedTask = await taskService.updateTaskStatus(id, status);
        res.status(200).json(mapTaskToResponse(updatedTask));
    } catch (error) {
        next(error);
    }
};

