import { BoardResponseDTO } from '../dto/board.dto';
import { mapUserToResponse } from './user.mapper';

export function mapBoardToResponse(board: any): BoardResponseDTO {
    return {
        id: board._id.toString(),
        title: board.title,
        description: board.description,
        owner: mapUserToResponse(board.owner),
        members: board.members.map(mapUserToResponse),
        isActive: board.isActive,
        createdAt: board.createdAt,
        updatedAt: board.updatedAt
    };
}
