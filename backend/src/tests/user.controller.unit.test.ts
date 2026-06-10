import { Request, Response, NextFunction } from 'express';
import * as userController from '../controller/user.controller';
import * as userService from '../services/user.service';

jest.mock('../services/user.service');

const mockedService = userService as jest.Mocked<typeof userService>;

const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const next: NextFunction = jest.fn();

const fakeUser = {
    _id: 'u1', username: 'johndoe', firstname: 'John', lastname: 'Doe',
    email: 'john@test.com', department: 'IT', position: 'Dev',
    role: { _id: 'r1', role: 'employee', description: 'Employee' },
    isActive: true, createdAt: new Date(), updatedAt: new Date()
};

beforeEach(() => jest.clearAllMocks());

describe('User Controller', () => {
    describe('getUsers', () => {
        it('returns 200 with list of users', async () => {
            const req = {} as any;
            const res = mockRes();
            mockedService.findUsers.mockResolvedValue([fakeUser] as any);

            await userController.getUsers(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('calls next on error', async () => {
            const req = {} as any;
            const res = mockRes();
            mockedService.findUsers.mockRejectedValue(new Error('DB error'));

            await userController.getUsers(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('getUserById', () => {
        it('returns 200 when user is found', async () => {
            const req = { params: { id: 'u1' } } as any;
            const res = mockRes();
            mockedService.findUserById.mockResolvedValue(fakeUser as any);

            await userController.getUserById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 when user is not found', async () => {
            const req = { params: { id: 'missing' } } as any;
            const res = mockRes();
            mockedService.findUserById.mockResolvedValue(null);

            await userController.getUserById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getUserByEmail', () => {
        it('returns 200 when user is found', async () => {
            const req = { params: { email: 'john@test.com' } } as any;
            const res = mockRes();
            mockedService.findUserByEmail.mockResolvedValue(fakeUser as any);

            await userController.getUserByEmail(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 when user is not found', async () => {
            const req = { params: { email: 'nobody@test.com' } } as any;
            const res = mockRes();
            mockedService.findUserByEmail.mockResolvedValue(null);

            await userController.getUserByEmail(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getUserByUsername', () => {
        it('returns 200 when user is found', async () => {
            const req = { params: { username: 'johndoe' } } as any;
            const res = mockRes();
            mockedService.findUserByUsername.mockResolvedValue(fakeUser as any);

            await userController.getUserByUsername(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 when user is not found', async () => {
            const req = { params: { username: 'ghost' } } as any;
            const res = mockRes();
            mockedService.findUserByUsername.mockResolvedValue(null);

            await userController.getUserByUsername(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('createUser', () => {
        it('returns 201 on successful creation', async () => {
            const req = { body: { firstname: 'New', email: 'new@test.com' } } as any;
            const res = mockRes();
            mockedService.createUser.mockResolvedValue(fakeUser as any);

            await userController.createUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('updateUser', () => {
        it('returns 200 on successful update', async () => {
            const req = { params: { id: 'u1' }, body: { firstname: 'Updated' } } as any;
            const res = mockRes();
            mockedService.updateUser.mockResolvedValue(fakeUser as any);

            await userController.updateUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 when user not found', async () => {
            const req = { params: { id: 'missing' }, body: {} } as any;
            const res = mockRes();
            mockedService.updateUser.mockResolvedValue(null);

            await userController.updateUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('softDelete', () => {
        it('returns 200 on successful soft delete', async () => {
            const req = { params: { id: 'u1' } } as any;
            const res = mockRes();
            mockedService.softDeleteUser.mockResolvedValue({ ...fakeUser, isActive: false } as any);

            await userController.softDelete(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 when user not found', async () => {
            const req = { params: { id: 'missing' } } as any;
            const res = mockRes();
            mockedService.softDeleteUser.mockResolvedValue(null);

            await userController.softDelete(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getUserSummaries', () => {
        it('returns 200 with user summaries', async () => {
            const req = {} as any;
            const res = mockRes();
            mockedService.findUsers.mockResolvedValue([fakeUser] as any);

            await userController.getUserSummaries(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('restoreUser', () => {
        it('returns 200 on successful restore', async () => {
            const req = { params: { id: 'u1' } } as any;
            const res = mockRes();
            mockedService.restoreUser.mockResolvedValue(fakeUser as any);

            await userController.restoreUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 when user not found', async () => {
            const req = { params: { id: 'missing' } } as any;
            const res = mockRes();
            mockedService.restoreUser.mockResolvedValue(null);

            await userController.restoreUser(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });
});
