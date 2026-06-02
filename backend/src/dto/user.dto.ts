import { RoleDTO } from './role.dto';

export interface CreateUserDTO {
    username?: string;
    firstname?: string;
    lastname?: string;
    googleId?: string;
    email: string;
    role: string;
    department?: string;
    position?: string;
}

export interface UpdateUserDTO {
    username?: string;
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
    firstname?: string;
    lastname?: string;
    email: string;
    googleId?: string;
    department?: string;
    position?: string;
    role: RoleDTO;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserSummaryDTO {
    id: string;
    firstname?: string;
    lastname?: string;
    department?: string;
    position?: string;
    
}