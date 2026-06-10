import * as taskService from '../services/task.service';
import * as taskDAO from '../dao/task.dao';
import * as boardDAO from '../dao/board.dao';
import User from '../models/user.model';
import { Types } from 'mongoose';

jest.mock('../dao/task.dao');
jest.mock('../dao/board.dao');
jest.mock('../models/user.model', () => ({
    __esModule: true,
    default: { findById: jest.fn() }
}));

const mockedTaskDAO = taskDAO as jest.Mocked<typeof taskDAO>;
const mockedBoardDAO = boardDAO as jest.Mocked<typeof boardDAO>;

describe('Task Service - Unit Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('findAll', () => {
        it('returns all tasks for admin', async () => {
            const tasks = [{ id: '1', title: 'Task One' }];
            mockedTaskDAO.findAll.mockResolvedValue(tasks as any);

            const result = await taskService.findAll('userId1', 'admin');

            expect(mockedTaskDAO.findAll).toHaveBeenCalled();
            expect(result).toEqual(tasks);
        });

        it('returns all tasks for manager', async () => {
            const tasks = [{ id: '2', title: 'Task Two' }];
            mockedTaskDAO.findAll.mockResolvedValue(tasks as any);

            const result = await taskService.findAll('userId2', 'manager');

            expect(mockedTaskDAO.findAll).toHaveBeenCalled();
            expect(result).toEqual(tasks);
        });

        it('returns only board tasks for employee', async () => {
            const boards = [{ _id: 'boardId1' }, { _id: 'boardId2' }];
            const tasks = [{ id: '3', title: 'Task Three' }];
            mockedBoardDAO.findByMember.mockResolvedValue(boards as any);
            mockedTaskDAO.findByBoardIds.mockResolvedValue(tasks as any);

            const result = await taskService.findAll('emp1', 'employee');

            expect(mockedBoardDAO.findByMember).toHaveBeenCalledWith('emp1');
            expect(mockedTaskDAO.findByBoardIds).toHaveBeenCalledWith(['boardId1', 'boardId2']);
            expect(result).toEqual(tasks);
        });
    });

    describe('findById', () => {
        it('returns task for admin regardless of assignment', async () => {
            const task = { assignedTo: { _id: { toString: () => 'someoneElse' } } };
            mockedTaskDAO.findById.mockResolvedValue(task as any);

            const result = await taskService.findById('taskId', 'adminId', 'admin');

            expect(result).toEqual(task);
        });

        it('returns task for manager regardless of assignment', async () => {
            const task = { assignedTo: { _id: { toString: () => 'someoneElse' } } };
            mockedTaskDAO.findById.mockResolvedValue(task as any);

            const result = await taskService.findById('taskId', 'managerId', 'manager');

            expect(result).toEqual(task);
        });

        it('returns task for employee if they are the assignee', async () => {
            const userId = 'emp123';
            const task = { assignedTo: { _id: { toString: () => userId } } };
            mockedTaskDAO.findById.mockResolvedValue(task as any);

            const result = await taskService.findById('taskId', userId, 'employee');

            expect(result).toEqual(task);
        });

        it('returns null for employee if not the assignee', async () => {
            const task = { assignedTo: { _id: { toString: () => 'someoneElse' } } };
            mockedTaskDAO.findById.mockResolvedValue(task as any);

            const result = await taskService.findById('taskId', 'emp123', 'employee');

            expect(result).toBeNull();
        });

        it('returns null if task does not exist', async () => {
            mockedTaskDAO.findById.mockResolvedValue(null);

            const result = await taskService.findById('nonexistent', 'userId', 'admin');

            expect(result).toBeNull();
        });
    });

    describe('createTask', () => {
        const validPayload = {
            title: 'New Task For Testing',
            board: new Types.ObjectId().toString(),
            assignedTo: new Types.ObjectId().toString(),
            assignedBy: new Types.ObjectId().toString(),
        };

        const mockUserChain = (returnValue: any) => {
            const exec = jest.fn().mockResolvedValue(returnValue);
            const lean = jest.fn().mockReturnValue({ exec });
            const populate = jest.fn().mockReturnValue({ lean });
            (User.findById as jest.Mock).mockReturnValue({ populate });
        };

        it('throws if assigner is not found', async () => {
            mockUserChain(null);

            await expect(taskService.createTask(validPayload))
                .rejects.toThrow('Assigning user not found');
        });

        it('throws if assigner role is employee', async () => {
            mockUserChain({ role: { role: 'employee' } });

            await expect(taskService.createTask(validPayload))
                .rejects.toThrow('Only managers or admins can assign tasks');
        });

        it('creates task when assigner is admin', async () => {
            mockUserChain({ role: { role: 'admin' } });
            const created = { id: 'newTask', title: validPayload.title };
            mockedTaskDAO.createTask.mockResolvedValue(created as any);

            const result = await taskService.createTask(validPayload);

            expect(mockedTaskDAO.createTask).toHaveBeenCalled();
            expect(result).toEqual(created);
        });

        it('creates task when assigner is manager', async () => {
            mockUserChain({ role: { role: 'manager' } });
            const created = { id: 'newTask2', title: validPayload.title };
            mockedTaskDAO.createTask.mockResolvedValue(created as any);

            const result = await taskService.createTask(validPayload);

            expect(mockedTaskDAO.createTask).toHaveBeenCalled();
            expect(result).toEqual(created);
        });
    });
});
