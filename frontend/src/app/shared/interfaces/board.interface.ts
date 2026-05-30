import { IUser } from './user.interface';

export interface Board {
  id: string;
    title: string;
    description?: string;
    owner: IUser; 
    members: IUser[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
};


