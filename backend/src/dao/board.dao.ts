import Board, { IBoard } from '../models/board.model';
import { Types } from 'mongoose';

export const findAll = async (): Promise<IBoard[]> => {
    return await Board.find({ isActive: true}).populate({ path: 'owner', select: '-password', populate: { path: 'role', select: 'role description' } })
.populate({ path: 'members', select: '-password', populate: { path: 'role', select: 'role description' } }).lean().exec();

};

// This function was created in order 
// to be able to find any inactive boards, 
// just in case a board is delete by mistake
// or if anyone wants to check the history.
export const findAllIncludingInactive = async (): Promise<IBoard[]> => {
    return await Board.find().populate({ path: 'owner', select: '-password', populate: { path: 'role', select: 'role description' } })
.populate({ path: 'members', select: '-password', populate: { path: 'role', select: 'role description' } }).lean().exec();
};

export const findById = async (id: string): Promise<IBoard | null> => {
    return await Board.findById(id).populate({ path: 'owner', select: '-password', populate: { path: 'role', select: 'role description' } })
.populate({ path: 'members', select: '-password', populate: { path: 'role', select: 'role description' } }).lean().exec();

}

export const createBoard = async (data: Partial<IBoard>): Promise<IBoard | null> => {
    const board = new Board(data);
    const saved = await board.save();
    return await Board.findById(saved._id).populate({ path: 'owner', select: '-password', populate: { path: 'role', select: 'role description' } })
.populate({ path: 'members', select: '-password', populate: { path: 'role', select: 'role description' } }).lean().exec();
}

export const updateBoard = async (id: string, payload: Partial<IBoard>): Promise<IBoard | null> => {
    return await Board.findByIdAndUpdate(id, payload, { new: true }).
        populate({ path: 'owner', select: '-password', populate: { path: 'role', select: 'role description' } })
.populate({ path: 'members', select: '-password', populate: { path: 'role', select: 'role description' } }).lean().exec();
};

export const softDeleteBoard = async (id: string): Promise<IBoard | null> => {
    return await Board.findByIdAndUpdate(id, { isActive: false }, { new: true })
    .populate({ path: 'owner', select: '-password', populate: { path: 'role', select: 'role description' } })
.populate({ path: 'members', select: '-password', populate: { path: 'role', select: 'role description' } }).lean().exec();
};

export const restoreBoard = async (id: string): Promise<IBoard | null> => {
    return await Board.findByIdAndUpdate(id, { isActive: true }, { new: true})
    .populate({ path: 'owner', select: '-password', populate: { path: 'role', select: 'role description' } })
.populate({ path: 'members', select: '-password', populate: { path: 'role', select: 'role description' } }).lean().exec();

};

export const addMemberToBoard = async (boardId: string, memberId: string): Promise<IBoard | null> => {
    return await Board.findByIdAndUpdate(boardId, { $addToSet: { members: memberId } }, { new: true })  //$addToSet was used to avoid a duplicate in case we were using $push.
    .populate({ path: 'owner', select: '-password', populate: { path: 'role', select: 'role description' } })
.populate({ path: 'members', select: '-password', populate: { path: 'role', select: 'role description' } }).lean().exec();
};

export const removeMemberFromBoard = async (boardId: string, memberId: string): Promise<IBoard | null> => {
    return await Board.findByIdAndUpdate(boardId, { $pull: { members: new Types.ObjectId(memberId) } } as any, { new: true })
    .populate({ path: 'owner', select: '-password', populate: { path: 'role', select: 'role description' } })
.populate({ path: 'members', select: '-password', populate: { path: 'role', select: 'role description' } }).lean().exec();
};

export const findByMember = async (userId: string): Promise<IBoard[]> => {
    return await Board.find({
        isActive: true,
        $or: [{ owner: userId }, { members: userId }]
    }).populate({ path: 'owner', select: '-password', populate: { path: 'role', select: 'role description' } })
.populate({ path: 'members', select: '-password', populate: { path: 'role', select: 'role description' } }).lean().exec();
};