import { TaskResponseDTO } from '../dto/task.dto';
import { mapUserToResponse } from './user.mapper';
import { mapBoardToResponse } from './board.mapper';

export function mapTaskToResponse(task: any): TaskResponseDTO {
    return {
        id: task._id.toString(),
        title: task.title,
        description: task.description,
        status: task.status,
        board: mapBoardToResponse(task.board),
        assignedTo: task.assignedTo ? mapUserToResponse(task.assignedTo) : undefined,
        assignedBy: task.assignedBy ? mapUserToResponse(task.assignedBy) : undefined,
        isActive: task.isActive,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
    };
}
