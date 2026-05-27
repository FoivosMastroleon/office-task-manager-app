import Task, { ITask } from '../models/task.model';
import { Types } from 'mongoose';

const boardPopulate = {
    path: 'board',
    populate: [
        { path: 'owner', select: '-password', populate: { path: 'role', select: 'role description' } },
        { path: 'members', select: '-password', populate: { path: 'role', select: 'role description' } }
    ]
};

const userPopulate = (field: string) => ({
    path: field,
    select: '-password',
    populate: { path: 'role', select: 'role description' }
});

export const findAll = async (): Promise<ITask[]> => {
    return await Task.find({ isActive: true })
        .populate(boardPopulate)
        .populate(userPopulate('assignedTo'))
        .populate(userPopulate('assignedBy'))
        .lean().exec();
};


export const findAllIncludingInactive = async (): Promise<ITask[]> => {
    return await Task.find()
        .populate(boardPopulate)
        .populate(userPopulate('assignedTo'))
        .populate(userPopulate('assignedBy'))
        .lean().exec();
};

export const findById = async (id: string): Promise<ITask | null> => {
    return await Task.findById(id)
        .populate(boardPopulate)
        .populate(userPopulate('assignedTo'))
        .populate(userPopulate('assignedBy'))
        .lean().exec();
};

export const createTask = async (data: Partial<ITask>): Promise<ITask | null> => {
    const task = new Task(data);
    const saved = await task.save();
    return await Task.findById(saved._id)
        .populate(boardPopulate)
        .populate(userPopulate('assignedTo'))
        .populate(userPopulate('assignedBy'))
        .lean().exec();
};

export const updateTask = async (id: string, payload: Partial<ITask>): Promise<ITask | null> => {
    return await Task.findByIdAndUpdate(id, payload, { new: true })
        .populate(boardPopulate)
        .populate(userPopulate('assignedTo'))
        .populate(userPopulate('assignedBy'))
        .lean().exec();
};


export const softDeleteTask = async (id: string): Promise<ITask | null> => {
    return await Task.findByIdAndUpdate(id, { isActive: false }, { new: true })
        .populate(boardPopulate)
        .populate(userPopulate('assignedTo'))
        .populate(userPopulate('assignedBy'))
        .lean().exec();
};

export const restoreTask = async (id: string): Promise<ITask | null> => {
    return await Task.findByIdAndUpdate(id, { isActive: true }, { new: true })
        .populate(boardPopulate)
        .populate(userPopulate('assignedTo'))
        .populate(userPopulate('assignedBy'))
        .lean().exec();
};

export const findByBoard = async (boardId: string): Promise<ITask[]> => {
    return await Task.find({ board: boardId, isActive: true })
        .populate(boardPopulate)
        .populate(userPopulate('assignedTo'))
        .populate(userPopulate('assignedBy'))
        .lean().exec();
};

export const findByAssignee = async (userId: string): Promise<ITask[]> => {
    return await Task.find({ assignedTo: userId, isActive: true })
        .populate(boardPopulate)
        .populate(userPopulate('assignedTo'))
        .populate(userPopulate('assignedBy'))
        .lean().exec();
};

export const updateTaskStatus = async (id: string, status: string): Promise<ITask | null> => {
    return await Task.findByIdAndUpdate(id, { status }, { new: true })
        .populate(boardPopulate)
        .populate(userPopulate('assignedTo'))
        .populate(userPopulate('assignedBy'))
        .lean().exec();
};

export const softDeleteByBoard = async (boardId: string): Promise<void> => {
    await Task.updateMany({ board: boardId, isActive: true }, { isActive: false });
};

export const findByBoardIds = async (boardIds: Types.ObjectId[]): Promise<ITask[]> => {
    return await Task.find({ board: { $in: boardIds }, isActive: true })
        .populate(boardPopulate)
        .populate(userPopulate('assignedTo'))
        .populate(userPopulate('assignedBy'))
        .lean().exec();
};
