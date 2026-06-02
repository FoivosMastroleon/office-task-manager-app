import { UserResponseDTO, UserSummaryDTO } from '../dto/user.dto';

export function mapUserToResponse(user: any): UserResponseDTO {
    return {
        id: user._id.toString(),
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        googleId: user.googleId,
        department: user.department,
        position: user.position,
        role: {
            id: user.role._id.toString(),
            role: user.role.role,
            description: user.role.description
        },
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}

export function mapUserToSummary(user: any): UserSummaryDTO {
    return {
        id: user._id.toString(),
        firstname: user.firstname,
        lastname: user.lastname,
        department: user.department,
        position: user.position,
    };
}
