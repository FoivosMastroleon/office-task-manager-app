import * as taskDAO from '../dao/task.dao';
import * as boardDAO from '../dao/board.dao';
import { ITask } from '../models/task.model';
import User from '../models/user.model';
import { IRole } from '../models/role.model';
import { Types } from 'mongoose';
import { CreateTaskDTO, UpdateTaskDTO, TaskStatus } from '../dto/task.dto';     

export const findAll = async (userId: string, role: string) => {
    if (role === 'admin' || role === 'manager') {
        return await taskDAO.findAll();
    }
    const boards = await boardDAO.findByMember(userId);
    const boardIds = boards.map((b: any) => b._id);
    return await taskDAO.findByBoardIds(boardIds);
}

export const findAllIncludingInactive = async () => {
    return await taskDAO.findAllIncludingInactive();
}

export const findById = async (id: string, requestingUserId?: string, role?: string) => {
    const task = await taskDAO.findById(id);
    if (!task) return null;
    if (!role || role === 'admin' || role === 'manager') return task;
    const assignedTo = (task.assignedTo as any)._id?.toString() ?? task.assignedTo.toString();
    return assignedTo === requestingUserId ? task : null;
}

export const createTask = async (payload: CreateTaskDTO) => {
    const boardId = new Types.ObjectId(payload.board);
    const assignedToId = new Types.ObjectId(payload.assignedTo);
    const assignedById = new Types.ObjectId(payload.assignedBy);

    const assigner = await User.findById(assignedById).populate('role', 'role').lean().exec();
    if (!assigner) throw new Error('Assigning user not found');
    const assignerRole = ((assigner.role as unknown) as IRole).role;
    if (assignerRole !== 'admin' && assignerRole !== 'manager') {
        throw new Error('Only managers or admins can assign tasks');
    }

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

export const findByBoard = async (boardId: string, requestingUserId?: string, role?: string) => {
    if (!role || role === 'admin' || role === 'manager') {
        return await taskDAO.findByBoard(boardId);
    }
    const board = await boardDAO.findById(boardId);
    if (!board) return null;
    const ownerId = (board.owner as any)._id?.toString() ?? board.owner.toString();
    const isMember = ownerId === requestingUserId ||
        board.members.some((m: any) => (m._id?.toString() ?? m.toString()) === requestingUserId);
    if (!isMember) return null;
    return await taskDAO.findByBoard(boardId);
};

export const findByAssignee = async (userId: string) => {
    return await taskDAO.findByAssignee(userId);
};

export const updateTaskStatus = async (id: string, status: TaskStatus) => {
    return await taskDAO.updateTaskStatus(id, status);
};
