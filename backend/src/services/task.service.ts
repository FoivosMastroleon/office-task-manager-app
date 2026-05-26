import * as taskDAO from '../dao/task.dao';
import { ITask } from '../models/task.model';
import { Types } from 'mongoose';
import { CreateTaskDTO, UpdateTaskDTO, TaskStatus } from '../dto/task.dto';     

export const findAll = async () => {
    return await taskDAO.findAll();
}

export const findAllIncludingInactive = async () => {
    return await taskDAO.findAllIncludingInactive();
}

export const findById = async (id: string) => {
    return await taskDAO.findById(id);
}

export const createTask = async (payload: CreateTaskDTO) => {
    const boardId = new Types.ObjectId(payload.board);
    const assignedToId = new Types.ObjectId(payload.assignedTo);
    const assignedById = new Types.ObjectId(payload.assignedBy);

    return await taskDAO.createTask({
        ...payload,
        board: boardId,
        assignedTo: assignedToId,
        assignedBy: assignedById
    });
}

export const updateTask = async (id: string, payload: UpdateTaskDTO) => {
    const updateData: Partial<ITask> = {};

    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.status !== undefined) updateData.status = payload.status;
    if (payload.dueDate !== undefined) updateData.dueDate = payload.dueDate;
    if (payload.board !== undefined) updateData.board = new Types.ObjectId(payload.board);
    if (payload.assignedTo !== undefined) updateData.assignedTo = new Types.ObjectId(payload.assignedTo);
    if (payload.assignedBy !== undefined) updateData.assignedBy = new Types.ObjectId(payload.assignedBy);

    return await taskDAO.updateTask(id, updateData);
};

export const softDeleteTask = async (id: string) => {
    return await taskDAO.softDeleteTask(id);
};

export const restoreTask = async (id: string) => {
    return await taskDAO.restoreTask(id);
};

export const findByBoard = async (boardId: string) => {
    return await taskDAO.findByBoard(boardId);
};

export const findByAssignee = async (userId: string) => {
    return await taskDAO.findByAssignee(userId);
};

export const updateTaskStatus = async (id: string, status: TaskStatus) => {
    return await taskDAO.updateTaskStatus(id, status);
};
