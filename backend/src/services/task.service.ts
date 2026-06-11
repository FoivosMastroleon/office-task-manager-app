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
    // Employees retrieve tasks via getTasksByAssignee in the frontend —
    // this board-based path is not currently used for the employee role.
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

// Only allow access if the requesting user is the assignee of the task.
// In case of an employee, trying to see a task that is not assigned to them,
// this will return null, and then, the controller sends a 404 Not Found, 
// without revealing that the task exists at all.   
    return assignedTo === requestingUserId ? task : null;
}


// Board schema stores owner separately from members — both are valid assignees. 
// This helper checks if a user is either the owner or a member of the board.
const isBoardMember = (board: any, userId: string): boolean => {
    const ownerId = (board.owner as any)._id?.toString() ?? board.owner.toString();
    return ownerId === userId ||
        board.members.some((m: any) => (m._id?.toString() ?? m.toString()) === userId);
};

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

    const board = await boardDAO.findById(payload.board);
    if (!board) throw new Error('Board not found');
    if (!isBoardMember(board, payload.assignedTo)) {
        throw new Error('Assigned user is not a member of this board');
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

    // For assignedTo and assignedBy, we need to convert to ObjectId and also validate
    // board membership if assignedTo or board is changing
    if (payload.assignedTo !== undefined) updateData.assignedTo = new Types.ObjectId(payload.assignedTo);
    if (payload.assignedBy !== undefined) updateData.assignedBy = new Types.ObjectId(payload.assignedBy);

    // Validate when either changes — swapping only the board can make the existing assignee invalid.
    if (payload.assignedTo !== undefined || payload.board !== undefined) {
        const existingTask = await taskDAO.findById(id);
        if (!existingTask) throw new Error('Task not found');

    // The double ?? is to handle cases where the field that comes from Mongoose,
    //  might already be an ObjectId or a populated object with _id.
        const boardId = payload.board ??
            ((existingTask.board as any)._id?.toString() ?? existingTask.board.toString());
        const assignedToId = payload.assignedTo ??
            ((existingTask.assignedTo as any)._id?.toString() ?? existingTask.assignedTo.toString());

        const board = await boardDAO.findById(boardId);
        if (!board) throw new Error('Board not found');
        if (!isBoardMember(board, assignedToId)) {
            throw new Error('Assigned user is not a member of this board');
        }
    }

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
