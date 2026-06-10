import { Request, Response, NextFunction } from 'express';
import * as boardController from '../controller/board.controller';
import * as boardService from '../services/board.service';

jest.mock('../services/board.service');

const mockedService = boardService as jest.Mocked<typeof boardService>;

const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
const next: NextFunction = jest.fn();

const fakeBoard = {
    _id: 'b1', title: 'Test Board', description: 'Desc',
    owner: { _id: 'u1', firstname: 'John', lastname: 'Doe' },
    members: [], isActive: true,
    createdAt: new Date(), updatedAt: new Date()
};

beforeEach(() => jest.clearAllMocks());

describe('Board Controller', () => {
    describe('getBoards', () => {
        it('returns 200 with boards', async () => {
            const req = { user: { userId: 'u1', role: 'admin' } } as any;
            const res = mockRes();
            mockedService.findAll.mockResolvedValue([fakeBoard] as any);

            await boardController.getBoards(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('calls next on error', async () => {
            const req = { user: { userId: 'u1', role: 'admin' } } as any;
            const res = mockRes();
            mockedService.findAll.mockRejectedValue(new Error('DB error'));

            await boardController.getBoards(req, res, next);

            expect(next).toHaveBeenCalled();
        });
    });

    describe('getBoardById', () => {
        it('returns 200 when board is found', async () => {
            const req = { params: { id: 'b1' }, user: { userId: 'u1', role: 'admin' } } as any;
            const res = mockRes();
            mockedService.findById.mockResolvedValue(fakeBoard as any);

            await boardController.getBoardById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });

        it('returns 404 when board is not found', async () => {
            const req = { params: { id: 'missing' }, user: { userId: 'u1', role: 'admin' } } as any;
            const res = mockRes();
            mockedService.findById.mockResolvedValue(null);

            await boardController.getBoardById(req, res, next);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getBoardsIncludingInactive', () => {
        it('returns 200 with all boards', async () => {
            const req = {} as any;
            const res = mockRes();
            mockedService.findAllIncludingInactive.mockResolvedValue([fakeBoard] as any);

            await boardController.getBoardsIncludingInactive(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('createBoard', () => {
        it('returns 201 on successful creation', async () => {
            const req = { body: { title: 'New Board' }, user: { userId: 'u1' } } as any;
            const res = mockRes();
            mockedService.createBoard.mockResolvedValue(fakeBoard as any);

            await boardController.createBoard(req, res, next);

            expect(res.status).toHaveBeenCalledWith(201);
        });
    });

    describe('updateBoard', () => {
        it('returns 200 on successful update', async () => {
            const req = { params: { id: 'b1' }, body: { title: 'Updated Board' } } as any;
            const res = mockRes();
            mockedService.updateBoard.mockResolvedValue({ ...fakeBoard, title: 'Updated Board' } as any);

            await boardController.updateBoard(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('deleteBoard', () => {
        it('returns 200 on successful soft delete', async () => {
            const req = { params: { id: 'b1' } } as any;
            const res = mockRes();
            mockedService.softDeleteBoard.mockResolvedValue(undefined as any);

            await boardController.deleteBoard(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('restoreBoard', () => {
        it('returns 200 on successful restore', async () => {
            const req = { params: { id: 'b1' } } as any;
            const res = mockRes();
            mockedService.restoreBoard.mockResolvedValue(fakeBoard as any);

            await boardController.restoreBoard(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('addMemberToBoard', () => {
        it('returns 200 when member is added', async () => {
            const req = { params: { boardId: 'b1', memberId: 'u2' } } as any;
            const res = mockRes();
            mockedService.addMemberToBoard.mockResolvedValue(fakeBoard as any);

            await boardController.addMemberToBoard(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });

    describe('removeMemberFromBoard', () => {
        it('returns 200 when member is removed', async () => {
            const req = { params: { boardId: 'b1', memberId: 'u2' } } as any;
            const res = mockRes();
            mockedService.removeMemberFromBoard.mockResolvedValue(fakeBoard as any);

            await boardController.removeMemberFromBoard(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
        });
    });
});
