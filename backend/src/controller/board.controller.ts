import { Request, Response, NextFunction } from 'express';
import * as boardService from '../services/board.service';
import { CreateBoardDTO } from '../dto/board.dto';

export const getBoards = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, role } = req.user;
        const boards = await boardService.findAll(userId, role);
        res.status(200).json(boards);
    } catch (error) {
        next(error);
    }
};

export const getBoardById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Board id' });
        const board = await boardService.findById(id);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        res.status(200).json(board);
    } catch (error) {
        next(error);
    }
};

export const getBoardsIncludingInactive = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const boards = await boardService.findAllIncludingInactive();
        res.status(200).json(boards);
    } catch (error) {
        next(error);
    }
};

export const createBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payload: CreateBoardDTO = req.body;
        const board = await boardService.createBoard(payload, req.user.userId);
        res.status(201).json(board);
    } catch (error) {
        next(error);
    }
};

export const updateBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Board id' });
        const payload: CreateBoardDTO = req.body;
        const updatedBoard = await boardService.updateBoard(id, payload);
        res.status(200).json(updatedBoard);
    } catch (error) {
        next(error);
    }
};

export const deleteBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Board id' });
        await boardService.softDeleteBoard(id);
        res.status(200).json({ message: 'Board soft deleted successfully' });
    } catch (error) {
        next(error);
    }
};


export const restoreBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (typeof id !== 'string') return res.status(400).json({ message: 'Invalid Board id' });
        const restoredBoard = await boardService.restoreBoard(id);
        res.status(200).json(restoredBoard);
    } catch (error) {
        next(error);
    }
};

export const addMemberToBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.boardId;
        const memberId = req.params.memberId;
        if (typeof boardId !== 'string' || typeof memberId !== 'string') {
            return res.status(400).json({ message: 'Invalid Board id or Member id' });
        }
        const updatedBoard = await boardService.addMemberToBoard(boardId, memberId);
        res.status(200).json(updatedBoard);
    } catch (error) {
        next(error);
    }
};

export const removeMemberFromBoard = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const boardId = req.params.boardId;
        const memberId = req.params.memberId;
        if (typeof boardId !== 'string' || typeof memberId !== 'string') {
            return res.status(400).json({ message: 'Invalid Board id or Member id' });
        }
        const updatedBoard = await boardService.removeMemberFromBoard(boardId, memberId);
        res.status(200).json(updatedBoard);
    } catch (error) {
        next(error);
    }
};
