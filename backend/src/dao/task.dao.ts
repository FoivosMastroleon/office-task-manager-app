import Task, { ITask } from '../models/task.model';
import { Types } from 'mongoose';

export const findAll = async (): Promise<ITask[]> => {
    return await Task.find({ isActive: true }).populate({ path: 'board' })
        .populate({ path: 'assignedTo', select: '-password', populate: { path: 'role', select: 'role description' } })
        .populate({ path: 'assignedBy', select: '-password', populate: { path: 'role', select: 'role description' } })
        .lean().exec();
};


export const findAllIncludingInactive = async (): Promise<ITask[]> => {
    return await Task.find().populate({ path: 'board' })
        .populate({ path: 'assignedTo', select: '-password', populate: { path: 'role', select: 'role description' } })
        .populate({ path: 'assignedBy', select: '-password', populate: { path: 'role', select: 'role description' } })
        .lean().exec();
};

export const findById = async (id: string): Promise<ITask | null> => {
    return await Task.findById(id).populate({ path: 'assignedTo', select: '-password', populate: { path: 'role', select: 'role description' } })
        .populate({ path: 'assignedBy', select: '-password', populate: { path: 'role', select: 'role description' } })
        .lean().exec();
};

export const createTask = async (data: Partial<ITask>): Promise<ITask | null> => {
    const task = new Task(data);
    const saved = await task.save();
    return await Task.findById(saved._id)
        .populate({ path: 'board' })
        .populate({ path: 'assignedTo', select: '-password', populate: { path: 'role', select: 'role description' } })
        .populate({ path: 'assignedBy', select: '-password', populate: { path: 'role', select: 'role description' } })
        .lean().exec();
};

export const updateTask = async (id: string, payload: Partial<ITask>): Promise<ITask | null> => {
    return await Task.findByIdAndUpdate
    (id, payload, { new: true }).populate({ path: 'board' })
        .populate({ path: 'assignedTo', select: '-password', populate: { path: 'role', select: 'role description' } })
        .populate({ path: 'assignedBy', select: '-password', populate: { path: 'role', select: 'role description' } })
        .lean().exec();
};


export const softDeleteTask = async (id: string): Promise<ITask | null> => {
    return await Task.findByIdAndUpdate
    (id, { isActive: false }, { new: true }).populate({ path: 'board' })
        .populate({ path: 'assignedTo', select: '-password', populate: { path: 'role', select: 'role description' } })
        .populate({ path: 'assignedBy', select: '-password', populate: { path: 'role', select: 'role description' } })
        .lean().exec();
};

export const restoreTask = async (id: string): Promise<ITask | null> => {
    return await Task.findByIdAndUpdate
    (id, { isActive: true }, { new: true }).populate({ path: 'board' })
        .populate({ path: 'assignedTo', select: '-password', populate: { path: 'role', select: 'role description' } })
        .populate({ path: 'assignedBy', select: '-password', populate: { path: 'role', select: 'role description' } })
        .lean().exec();
};

export const findByBoard = async (boardId: string): Promise<ITask[]> => {
    return await Task.find({ board: boardId, isActive: true }).populate({ path: 'board' })
        .populate({ path: 'assignedTo', select: '-password', populate: { path: 'role', select: 'role description' } })
        .populate({ path: 'assignedBy', select: '-password', populate: { path: 'role', select: 'role description' } })
        .lean().exec();
};

export const findByAssignee = async (userId: string): Promise<ITask[]> => {
    return await Task.find({ assignedTo: userId, isActive: true }).populate({ path: 'board' })
        .populate({ path: 'assignedTo', select: '-password', populate: { path: 'role', select: 'role description' } })
        .populate({ path: 'assignedBy', select: '-password', populate: { path: 'role', select: 'role description' } })
        .lean().exec()
};

export const updateTaskStatus = async (id: string, status: string): Promise<ITask | null> => {
    return await Task.findByIdAndUpdate(id, { status }, { new: true }).populate({ path: 'board' })
        .populate({ path: 'assignedTo', select: '-password', populate: { path: 'role', select: 'role description' } })
        .populate({ path: 'assignedBy', select: '-password', populate: { path: 'role', select: 'role description' } })
        .lean().exec();
};

export const softDeleteByBoard = async (boardId: string): Promise<void> => {
    await Task.updateMany({ board: boardId, isActive: true }, { isActive: false });
};

export const findByBoardIds = async (boardIds: Types.ObjectId[]): Promise<ITask[]> => {
    return await Task.find({ board: { $in: boardIds }, isActive: true })
        .populate({ path: 'board' })
        .populate({ path: 'assignedTo', select: '-password', populate: { path: 'role', select: 'role description' } })
        .populate({ path: 'assignedBy', select: '-password', populate: { path: 'role', select: 'role description' } })
        .lean().exec();
};
