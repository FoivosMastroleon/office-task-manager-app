import * as boardDAO from '../dao/board.dao';
import * as taskDAO from '../dao/task.dao';
import { IBoard } from '../models/board.model';
import { Types } from 'mongoose';
import { CreateBoardDTO, UpdateBoardDTO } from '../dto/board.dto';


export const findAll = async (userId: string, role: string) => {
    if (role === 'admin' || role === 'manager') {
        return await boardDAO.findAll();
    }
    return await boardDAO.findByMember(userId);
}

export const findAllIncludingInactive = async () => {
    return await boardDAO.findAllIncludingInactive();
}


export const findById = async (id: string, requestingUserId?: string, role?: string) => {
    const board = await boardDAO.findById(id);
    if (!board) return null;
    if (!role || role === 'admin' || role === 'manager') return board;
    const ownerId = (board.owner as any)._id?.toString() ?? board.owner.toString();
    const isMember = ownerId === requestingUserId ||
        board.members.some((m: any) => (m._id?.toString() ?? m.toString()) === requestingUserId);

        
// Only allow access if the requesting user is the owner or a member of the board.
// In case of an employee, trying to see a board that they don't belong to, 
// this will return null, and then, the controller sends a 404 Not Found, 
// without revealing that the board exists at all.
    return isMember ? board : null;
}

export const createBoard = async (payload: CreateBoardDTO, ownerId: string) => {
    const ownerObjectId = new Types.ObjectId(ownerId);
    const memberIds = payload.members ? payload.members.map(id => new Types.ObjectId(id)) : [];

    return await boardDAO.createBoard({ ...payload, owner: ownerObjectId, members: memberIds });
}

export const updateBoard = async (id: string, payload: UpdateBoardDTO) => {
    const updateData: Partial<IBoard> = {};

    if (payload.title !== undefined) updateData.title = payload.title;
    if (payload.description !== undefined) updateData.description = payload.description;
    if (payload.members !== undefined) {
        updateData.members = payload.members.map(id => new Types.ObjectId(id));
    }

    return await boardDAO.updateBoard(id, updateData);
};

// Soft delete of a board also soft deletes all its tasks,
// to maintain data integrity and prevent tasks that belong
// to a deleted board, so the deletion order matters.
export const softDeleteBoard = async (id: string) => {
    await taskDAO.softDeleteByBoard(id);
    return await boardDAO.softDeleteBoard(id);
}

export const restoreBoard = async (id: string) => {
    return await boardDAO.restoreBoard(id);
};

export const addMemberToBoard = async (boardId: string, memberId: string) => {
    return await boardDAO.addMemberToBoard(boardId, memberId);  
};

export const removeMemberFromBoard = async (boardId: string, memberId: string) => {
    return await boardDAO.removeMemberFromBoard(boardId, memberId);
};  
