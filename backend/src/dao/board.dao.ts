import Board, { IBoard } from '../models/board.model';

export const findAll = async (): Promise<IBoard[]> => {
    return await Board.find({ isActive: true}).populate('owner').populate('members').lean().exec();

};

export const findAllIncludingInactive = async (): Promise<IBoard[]> => {
    return await Board.find().populate('owner').populate('members').lean().exec();
};

