import { mapUserToResponse, mapUserToSummary } from '../mappers/user.mapper';
import { mapTaskToResponse } from '../mappers/task.mapper';
import { mapBoardToResponse } from '../mappers/board.mapper';
import { Types } from 'mongoose';

const id = new Types.ObjectId();
const roleId = new Types.ObjectId();
const boardId = new Types.ObjectId();

const mockUser = {
    _id: id,
    username: 'johndoe',
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@test.com',
    googleId: 'g123',
    department: 'IT',
    position: 'Developer',
    role: { _id: roleId, role: 'employee', description: 'Employee role' },
    isActive: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-06-01')
};

const mockBoard = {
    _id: boardId,
    title: 'Board One',
    description: 'Desc',
    owner: mockUser,
    members: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
};

describe('User Mapper', () => {
    describe('mapUserToResponse', () => {
        it('maps all fields correctly', () => {
            const result = mapUserToResponse(mockUser);

            expect(result.id).toBe(id.toString());
            expect(result.username).toBe('johndoe');
            expect(result.email).toBe('john@test.com');
            expect(result.role.role).toBe('employee');
            expect(result.isActive).toBe(true);
        });
    });

    describe('mapUserToSummary', () => {
        it('maps only summary fields', () => {
            const result = mapUserToSummary(mockUser);

            expect(result.id).toBe(id.toString());
            expect(result.firstname).toBe('John');
            expect(result.lastname).toBe('Doe');
            expect(result.department).toBe('IT');
            expect(result.position).toBe('Developer');
            expect((result as any).email).toBeUndefined();
        });
    });
});

describe('Task Mapper', () => {
    it('maps task with all optional fields present', () => {
        const task = {
            _id: id,
            title: 'Test Task',
            description: 'A description',
            status: 'todo',
            board: mockBoard,
            assignedTo: mockUser,
            assignedBy: mockUser,
            dueDate: new Date('2026-07-01'),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = mapTaskToResponse(task);

        expect(result.id).toBe(id.toString());
        expect(result.title).toBe('Test Task');
        expect(result.description).toBe('A description');
        expect(result.dueDate).toBeDefined();
    });

    it('maps task with missing optional fields as undefined', () => {
        const task = {
            _id: id,
            title: 'Minimal Task',
            status: 'todo',
            board: mockBoard,
            assignedTo: null,
            assignedBy: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = mapTaskToResponse(task);

        expect(result.id).toBe(id.toString());
        expect(result.description).toBeUndefined();
        expect(result.dueDate).toBeUndefined();
        expect(result.assignedTo).toBeUndefined();
    });
});

describe('Board Mapper', () => {
    it('maps board with all fields correctly', () => {
        const result = mapBoardToResponse(mockBoard);

        expect(result.id).toBe(boardId.toString());
        expect(result.title).toBe('Board One');
        expect(result.members).toHaveLength(0);
    });

    it('maps board with members', () => {
        const boardWithMembers = { ...mockBoard, members: [mockUser] };
        const result = mapBoardToResponse(boardWithMembers);

        expect(result.members).toHaveLength(1);
        expect(result.members[0].id).toBe(id.toString());
    });
});
