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
        assignedTo: mapUserToResponse(task.assignedTo),
        assignedBy: mapUserToResponse(task.assignedBy),
        isActive: task.isActive,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt
    };
}
