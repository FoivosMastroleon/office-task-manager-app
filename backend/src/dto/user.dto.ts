import { RoleDTO } from './role.dto';

export interface CreateUserDTO {
    username: string;
    password?: string;
    firstname: string;
    lastname: string;
    googleId?: string;
    email: string;
    role: string;
    department: string;
    position: string;
}

export interface UpdateUserDTO {
    username?: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    googleId?: string;
    email?: string;
    role?: string;
    department?: string;
    position?: string;
    isActive?: boolean;
}

export interface UserResponseDTO {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    googleId?: string;
    department: string;
    position: string;
    role: RoleDTO;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
