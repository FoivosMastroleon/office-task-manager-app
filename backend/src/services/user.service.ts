import * as userDAO from '../dao/user.dao';
import { IUser } from '../models/user.model';
import { Types } from 'mongoose';
import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';

export const findUsers = async () => {
    return await userDAO.findAll();
};

export const findUserById = async (id: string) => {
    return await userDAO.findById(id);
};

export const findUserByEmail = async (email: string) => {
    return await userDAO.findByEmail(email);
};

export const findUserByUsername = async (username: string) => {
    return await userDAO.findByUsername(username);
};

export const createUser = async (payload: CreateUserDTO) => {
    const roleId = new Types.ObjectId(payload.role);
    const username = payload.username ?? payload.email;

    return await userDAO.createUser({ ...payload, username, role: roleId });
};

export const updateUser = async (id: string, payload: UpdateUserDTO) => {
    const updateData: Partial<IUser> = {};

    if (payload.firstname !== undefined) updateData.firstname = payload.firstname;
    if (payload.lastname !== undefined) updateData.lastname = payload.lastname;
    if (payload.email !== undefined) updateData.email = payload.email;
    if (payload.username !== undefined) updateData.username = payload.username;
    if (payload.department !== undefined) updateData.department = payload.department;
    if (payload.position !== undefined) updateData.position = payload.position;
    if (payload.isActive !== undefined) updateData.isActive = payload.isActive;

    if (payload.role !== undefined) {
        updateData.role = new Types.ObjectId(payload.role);
    }

    return await userDAO.updateUser(id, updateData);
};

export const softDeleteUser = async (id: string) => {
    return await userDAO.softDeleteUser(id);
};

export const restoreUser = async (id: string) => {
    return await userDAO.restoreUser(id);
};
