import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';
import { CreateTaskDTO, UpdateTaskDTO } from '../dto/task.dto';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await taskService.findAll();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

export const getTasksIncludingInactive = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await taskService.findAllIncludingInactive();
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Task id' });
        const task = await taskService.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        next(error);
    }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload: CreateTaskDTO = req.body;
        const task = await taskService.createTask(payload);
        res.status(201).json(task);
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
        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Task id' });
        await taskService.softDeleteTask(id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        next(error);
    }
};  

export const restoreTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Task id' });
        const restoredTask = await taskService.restoreTask(id);
        res.status(200).json(restoredTask);
    } catch (error) {
        next(error);
    }
};

export const getTasksByBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.boardId;
        if (typeof boardId !== 'string') return res.status(400).json({ message: 'Invalid Board id' });
        const tasks = await taskService.findByBoard(boardId);
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }
};


export const getTasksByAssignee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        if (typeof userId !== 'string') return res.status(400).json({ message: 'Invalid User id' });
        const tasks = await taskService.findByAssignee(userId);
        res.status(200).json(tasks);
    } catch (error) {
        next(error);
    }};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Task id' });
        const status = req.body.status;
        const updatedTask = await taskService.updateTaskStatus(id, status);
        res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
};

