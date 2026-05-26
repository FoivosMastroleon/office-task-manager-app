import Board, { IBoard } from '../models/board.model';

export const findAll = async (): Promise<IBoard[]> => {
    return await Board.find({ isActive: true}).populate('owner').populate('members').lean().exec();

};

// This function was created in order 
// to be able to find any inactive boards, 
// just in case a board is delete by mistake
// or if anyone wants to check the history.
export const findAllIncludingInactive = async (): Promise<IBoard[]> => {
    return await Board.find().populate('owner').populate('members').lean().exec();
};

export const findById = async (id: string): Promise<IBoard | null> => {
    return await Board.findById(id).populate('owner').populate('members').lean().exec();

}

export const createBoard = async (data: Partial<IBoard>): Promise<IBoard | null> => {
    const board = new Board(data);
    const saved = await board.save();
    return await Board.findById(saved._id).populate('owner').populate('members').lean().exec();
}

export const updateBoard = async (id: string, payload: Partial<IBoard>): Promise<IBoard | null> => {
    return await Board.findByIdAndUpdate(id, payload, { new: true }).
        populate('owner').populate('members').lean().exec();
};

export const softDeleteBoard = async (id: string): Promise<IBoard | null> => {
    return await Board.findByIdAndUpdate(id, { isActive: false }, { new: true })
    .populate('owner').populate('members').lean().exec();
};

export const restoreBoard = async (id: string): Promise<IBoard | null> => {
    return await Board.findByIdAndUpdate(id, { isActive: true }, { new: true})
    .populate('owner').populate('members').lean().exec();

};

export const addMemberToBoard = async (boardId: string, memberId: string): Promise<IBoard | null> => {
    return await Board.findByIdAndUpdate(boardId, { $addToSet: { members: memberId } }, { new: true })  //$addToSet was used to avoid a duplicate in case we were using $push.
    .populate('owner').populate('members').lean().exec();
};

export const removeMemberFromBoard = async (boardId: string, memberId: string): Promise<IBoard | null> => {
    return await Board.findByIdAndUpdate(boardId, { $pull: { members: memberId } }, { new: true })
    .populate('owner').populate('members').lean().exec();
};

export const findByMember = async (userId: string): Promise<IBoard[]> => {
    return await Board.find({
        isActive: true,
        $or: [{ owner: userId }, { members: userId }]
    }).populate('owner').populate('members').lean().exec();
};