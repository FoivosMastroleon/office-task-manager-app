import { UserResponseDTO } from './user.dto';
import { BoardResponseDTO } from './board.dto';

export type TaskStatus = 'todo' | 'working_on_it' | 'done';

export interface CreateTaskDTO {
    title: string;
    description?: string;
    // status: 'todo';
    board: string;
    assignedTo: string;
    assignedBy: string;
    dueDate?: Date;


}

export interface UpdateTaskStatusDTO {
    status: TaskStatus;
}   

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    status?: TaskStatus;
    board?: string;
    assignedTo?: string;
    assignedBy?: string;
    dueDate?: Date;

}

export interface TaskResponseDTO {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    board: BoardResponseDTO;
    isActive: boolean;
    assignedTo: UserResponseDTO;
    assignedBy: UserResponseDTO;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}
 