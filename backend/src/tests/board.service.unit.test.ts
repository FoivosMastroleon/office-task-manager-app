import * as boardService from '../services/board.service';
import * as boardDAO from '../dao/board.dao';
import * as taskDAO from '../dao/task.dao';

jest.mock('../dao/board.dao');
jest.mock('../dao/task.dao');

const mockedBoardDAO = boardDAO as jest.Mocked<typeof boardDAO>;
const mockedTaskDAO = taskDAO as jest.Mocked<typeof taskDAO>;

describe('Board Service - Unit Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('findAll', () => {
        it('returns all boards for admin', async () => {
            const boards = [{ id: '1', title: 'Board One' }];
            mockedBoardDAO.findAll.mockResolvedValue(boards as any);

            const result = await boardService.findAll('userId', 'admin');

            expect(mockedBoardDAO.findAll).toHaveBeenCalled();
            expect(result).toEqual(boards);
        });

        it('returns all boards for manager', async () => {
            const boards = [{ id: '2', title: 'Board Two' }];
            mockedBoardDAO.findAll.mockResolvedValue(boards as any);

            const result = await boardService.findAll('userId', 'manager');

            expect(mockedBoardDAO.findAll).toHaveBeenCalled();
            expect(result).toEqual(boards);
        });

        it('returns only member boards for employee', async () => {
            const boards = [{ id: '3', title: 'My Board' }];
            mockedBoardDAO.findByMember.mockResolvedValue(boards as any);

            const result = await boardService.findAll('emp1', 'employee');

            expect(mockedBoardDAO.findByMember).toHaveBeenCalledWith('emp1');
            expect(result).toEqual(boards);
        });
    });

    describe('findById', () => {
        it('returns null if board does not exist', async () => {
            mockedBoardDAO.findById.mockResolvedValue(null);

            const result = await boardService.findById('nonexistent', 'userId', 'admin');

            expect(result).toBeNull();
        });

        it('returns board for admin regardless of membership', async () => {
            const board = { owner: { _id: { toString: () => 'other' } }, members: [] };
            mockedBoardDAO.findById.mockResolvedValue(board as any);

            const result = await boardService.findById('boardId', 'adminId', 'admin');

            expect(result).toEqual(board);
        });

        it('returns board for manager regardless of membership', async () => {
            const board = { owner: { _id: { toString: () => 'other' } }, members: [] };
            mockedBoardDAO.findById.mockResolvedValue(board as any);

            const result = await boardService.findById('boardId', 'managerId', 'manager');

            expect(result).toEqual(board);
        });

        it('returns board for employee who is the owner', async () => {
            const userId = 'emp123';
            const board = { owner: { _id: { toString: () => userId } }, members: [] };
            mockedBoardDAO.findById.mockResolvedValue(board as any);

            const result = await boardService.findById('boardId', userId, 'employee');

            expect(result).toEqual(board);
        });

        it('returns board for employee who is a member', async () => {
            const userId = 'emp123';
            const board = {
                owner: { _id: { toString: () => 'ownerX' } },
                members: [{ _id: { toString: () => userId } }]
            };
            mockedBoardDAO.findById.mockResolvedValue(board as any);

            const result = await boardService.findById('boardId', userId, 'employee');

            expect(result).toEqual(board);
        });

        it('returns null for employee who is not owner or member', async () => {
            const board = {
                owner: { _id: { toString: () => 'ownerX' } },
                members: [{ _id: { toString: () => 'memberY' } }]
            };
            mockedBoardDAO.findById.mockResolvedValue(board as any);

            const result = await boardService.findById('boardId', 'emp123', 'employee');

            expect(result).toBeNull();
        });
    });

    describe('softDeleteBoard', () => {
        it('soft deletes all board tasks before deleting the board', async () => {
            mockedTaskDAO.softDeleteByBoard.mockResolvedValue(undefined as any);
            mockedBoardDAO.softDeleteBoard.mockResolvedValue({ isActive: false } as any);

            await boardService.softDeleteBoard('boardId1');

            expect(mockedTaskDAO.softDeleteByBoard).toHaveBeenCalledWith('boardId1');
            expect(mockedBoardDAO.softDeleteBoard).toHaveBeenCalledWith('boardId1');
        });

        it('calls taskDAO before boardDAO (correct order)', async () => {
            const callOrder: string[] = [];
            mockedTaskDAO.softDeleteByBoard.mockImplementation(async () => { callOrder.push('tasks'); return undefined as any; });
            mockedBoardDAO.softDeleteBoard.mockImplementation(async () => { callOrder.push('board'); return {} as any; });

            await boardService.softDeleteBoard('boardId1');

            expect(callOrder).toEqual(['tasks', 'board']);
        });
    });
});
