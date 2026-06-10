import { Request, Response, NextFunction } from 'express';
import * as taskController from '../controller/task.controller';
import * as taskService from '../services/task.service';

jest.mock('../services/task.service');

const mockedService = taskService as jest.Mocked<typeof taskService>;

const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const next: NextFunction = jest.fn();

const fakeTask = {
    _id: '123', title: 'Task', status: 'todo', isActive: true,
    board: { _id: 'b1', title: 'Board' },
    assignedTo: { _id: 'u1', firstname: 'A', lastname: 'B' },
    assignedBy: { _id: 'u2', firstname: 'C', lastname: 'D' },
    createdAt: new Date(), updatedAt: new Date()
};

beforeEach(() => jest.clearAllMocks());

describe('Task Controller', () => {
    describe('getTasks', () => {
        it('returns 200 with mapped tasks', async () => {
            const req = { user: { userId: 'u1', role: 'admin' } } as any;
            const res = mockRes();
            mockedService.findAll.mockResolvedValue([fakeTask] as any);

            await taskController.getTasks(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('calls next on error', async () => {
            const req = { user: { userId: 'u1', role: 'admin' } } as any;
            const res = mockRes();
            mockedService.findAll.mockRejectedValue(new Error('DB error'));

            await taskController.getTasks(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('getTasksIncludingInactive', () => {
        it('returns 200 with all tasks', async () => {
            const req = {} as any;
            const res = mockRes();
            mockedService.findAllIncludingInactive.mockResolvedValue([fakeTask] as any);

            await taskController.getTasksIncludingInactive(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getTaskById', () => {
        it('returns 200 when task is found', async () => {
            const req = { params: { id: '123' }, user: { userId: 'u1', role: 'admin' } } as any;
            const res = mockRes();
            mockedService.findById.mockResolvedValue(fakeTask as any);

            await taskController.getTaskById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 when task is not found', async () => {
            const req = { params: { id: 'missing' }, user: { userId: 'u1', role: 'admin' } } as any;
            const res = mockRes();
            mockedService.findById.mockResolvedValue(null);

            await taskController.getTaskById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('createTask', () => {
        it('returns 201 on successful creation', async () => {
            const req = { body: { title: 'New Task' }, user: { userId: 'u1', role: 'manager' } } as any;
            const res = mockRes();
            mockedService.createTask.mockResolvedValue(fakeTask as any);

            await taskController.createTask(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('updateTask', () => {
        it('returns 200 on successful update', async () => {
            const req = { params: { id: '123' }, body: { title: 'Updated' }, user: {} } as any;
            const res = mockRes();
            mockedService.updateTask.mockResolvedValue({ ...fakeTask, title: 'Updated' } as any);

            await taskController.updateTask(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteTask', () => {
        it('returns 200 on successful soft delete', async () => {
            const req = { params: { id: '123' }, user: {} } as any;
            const res = mockRes();
            mockedService.softDeleteTask.mockResolvedValue({ ...fakeTask, isActive: false } as any);

            await taskController.deleteTask(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('restoreTask', () => {
        it('returns 200 on successful restore', async () => {
            const req = { params: { id: '123' }, user: {} } as any;
            const res = mockRes();
            mockedService.restoreTask.mockResolvedValue(fakeTask as any);

            await taskController.restoreTask(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('getTasksByBoard', () => {
        it('returns 200 with tasks for the board', async () => {
            const req = { params: { boardId: 'b1' }, user: { userId: 'u1', role: 'admin' } } as any;
            const res = mockRes();
            mockedService.findByBoard.mockResolvedValue([fakeTask] as any);

            await taskController.getTasksByBoard(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 403 when service returns null (access denied)', async () => {
            const req = { params: { boardId: 'b1' }, user: { userId: 'u1', role: 'employee' } } as any;
            const res = mockRes();
            mockedService.findByBoard.mockResolvedValue(null as any);

            await taskController.getTasksByBoard(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('getTasksByAssignee', () => {
        it('returns 200 when admin requests any user tasks', async () => {
            const req = { params: { userId: 'u2' }, user: { userId: 'u1', role: 'admin' } } as any;
            const res = mockRes();
            mockedService.findByAssignee.mockResolvedValue([fakeTask] as any);

            await taskController.getTasksByAssignee(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 403 when employee requests another user tasks', async () => {
            const req = { params: { userId: 'u99' }, user: { userId: 'u1', role: 'employee' } } as any;
            const res = mockRes();

            await taskController.getTasksByAssignee(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('updateTaskStatus', () => {
        it('returns 200 on status update for admin', async () => {
            const req = { params: { id: '123' }, body: { status: 'done' }, user: { userId: 'u1', role: 'admin' } } as any;
            const res = mockRes();
            mockedService.updateTaskStatus.mockResolvedValue({ ...fakeTask, status: 'done' } as any);

            await taskController.updateTaskStatus(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 for employee when task not found or unauthorized', async () => {
            const req = { params: { id: '123' }, body: { status: 'done' }, user: { userId: 'u1', role: 'employee' } } as any;
            const res = mockRes();
            mockedService.findById.mockResolvedValue(null);

            await taskController.updateTaskStatus(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
