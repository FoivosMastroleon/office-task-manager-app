import User, { IUser } from '../models/user.model';

export const findAll = async (): Promise<IUser[]> => {
    return await User.find().populate('role', 'role description').lean().exec();
};

export const findById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id).populate('role', 'role description').lean().exec();
};

export const findByEmail = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email }).populate('role', 'role description').lean().exec();
};

export const findByUsername = async (username: string): Promise<IUser | null> => {
    return await User.findOne({ username }).populate('role', 'role description').lean().exec();
};

export const createUser = async (data: Partial<IUser>): Promise<IUser> => {
    const user = new User(data);
    return await user.save();
};

export const updateUser = async (id: string, payload: Partial<IUser>): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(id, payload, { new: true }).populate('role', 'role description').lean().exec();
};

export const softDeleteUser = async (id: string): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    ).populate('role', 'role description').lean().exec();
};
