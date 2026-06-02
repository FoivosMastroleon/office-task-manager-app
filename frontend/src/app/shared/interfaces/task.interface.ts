import { Board } from './board.interface';
import { IUser } from './user.interface';



export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'working_on_it' | 'done';
    board: Board;
    isActive: boolean;
    assignedTo?: IUser;
    assignedBy?: IUser;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
  
}