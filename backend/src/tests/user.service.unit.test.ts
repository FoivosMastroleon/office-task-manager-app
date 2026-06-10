import * as userService from '../services/user.service';
import * as userDAO from '../dao/user.dao';
import { Types } from 'mongoose';

jest.mock('../dao/user.dao');

const mockedUserDAO = userDAO as jest.Mocked<typeof userDAO>;

describe('User Service - Unit Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('findUsers', () => {
        it('returns all users', async () => {
            const users = [{ id: '1', firstname: 'John' }];
            mockedUserDAO.findAll.mockResolvedValue(users as any);

            const result = await userService.findUsers();

            expect(mockedUserDAO.findAll).toHaveBeenCalled();
            expect(result).toEqual(users);
        });
    });

    describe('findUserById', () => {
        it('returns user by id', async () => {
            const user = { id: 'u1', firstname: 'Jane' };
            mockedUserDAO.findById.mockResolvedValue(user as any);

            const result = await userService.findUserById('u1');

            expect(mockedUserDAO.findById).toHaveBeenCalledWith('u1');
            expect(result).toEqual(user);
        });
    });

    describe('findUserByEmail', () => {
        it('returns user by email', async () => {
            const user = { id: 'u2', email: 'test@test.com' };
            mockedUserDAO.findByEmail.mockResolvedValue(user as any);

            const result = await userService.findUserByEmail('test@test.com');

            expect(mockedUserDAO.findByEmail).toHaveBeenCalledWith('test@test.com');
            expect(result).toEqual(user);
        });
    });

    describe('findUserByUsername', () => {
        it('returns user by username', async () => {
            const user = { id: 'u3', username: 'johndoe' };
            mockedUserDAO.findByUsername.mockResolvedValue(user as any);

            const result = await userService.findUserByUsername('johndoe');

            expect(mockedUserDAO.findByUsername).toHaveBeenCalledWith('johndoe');
            expect(result).toEqual(user);
        });
    });

    describe('createUser', () => {
        const roleId = new Types.ObjectId().toString();

        it('uses provided username', async () => {
            const payload = { username: 'myuser', email: 'my@test.com', role: roleId };
            const created = { id: 'newU', username: 'myuser' };
            mockedUserDAO.createUser.mockResolvedValue(created as any);

            await userService.createUser(payload);

            expect(mockedUserDAO.createUser).toHaveBeenCalledWith(
                expect.objectContaining({ username: 'myuser' })
            );
        });

        it('falls back to email as username when username is not provided', async () => {
            const payload = { email: 'fallback@test.com', role: roleId };
            mockedUserDAO.createUser.mockResolvedValue({} as any);

            await userService.createUser(payload);

            expect(mockedUserDAO.createUser).toHaveBeenCalledWith(
                expect.objectContaining({ username: 'fallback@test.com' })
            );
        });

        it('converts role string to ObjectId', async () => {
            const payload = { email: 'test@test.com', role: roleId };
            mockedUserDAO.createUser.mockResolvedValue({} as any);

            await userService.createUser(payload);

            const calledWith = mockedUserDAO.createUser.mock.calls[0][0];
            expect(calledWith.role).toBeInstanceOf(Types.ObjectId);
        });
    });

    describe('updateUser', () => {
        it('only includes defined fields in the update', async () => {
            const updated = { id: 'u1', firstname: 'Updated' };
            mockedUserDAO.updateUser.mockResolvedValue(updated as any);

            await userService.updateUser('u1', { firstname: 'Updated' });

            const calledWith = mockedUserDAO.updateUser.mock.calls[0][1];
            expect(calledWith).toHaveProperty('firstname', 'Updated');
            expect(calledWith).not.toHaveProperty('email');
            expect(calledWith).not.toHaveProperty('role');
        });

        it('converts role string to ObjectId when role is provided', async () => {
            const roleId = new Types.ObjectId().toString();
            mockedUserDAO.updateUser.mockResolvedValue({} as any);

            await userService.updateUser('u1', { role: roleId });

            const calledWith = mockedUserDAO.updateUser.mock.calls[0][1];
            expect(calledWith.role).toBeInstanceOf(Types.ObjectId);
        });
    });

    describe('softDeleteUser', () => {
        it('calls userDAO softDeleteUser', async () => {
            mockedUserDAO.softDeleteUser.mockResolvedValue({ isActive: false } as any);

            await userService.softDeleteUser('u1');

            expect(mockedUserDAO.softDeleteUser).toHaveBeenCalledWith('u1');
        });
    });

    describe('restoreUser', () => {
        it('calls userDAO restoreUser', async () => {
            mockedUserDAO.restoreUser.mockResolvedValue({ isActive: true } as any);

            await userService.restoreUser('u1');

            expect(mockedUserDAO.restoreUser).toHaveBeenCalledWith('u1');
        });
    });
});
