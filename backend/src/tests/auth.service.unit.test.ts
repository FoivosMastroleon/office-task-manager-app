import * as authService from '../services/auth.service';
import { verifyGoogleIdToken } from '../utils/googleVerify';
import Role from '../models/role.model';
import User from '../models/user.model';
import * as userDAO from '../dao/user.dao';

jest.mock('../utils/googleVerify');
jest.mock('../dao/user.dao');
jest.mock('../models/role.model', () => ({
    __esModule: true,
    default: { findOne: jest.fn(), create: jest.fn() }
}));
jest.mock('../models/user.model', () => ({
    __esModule: true,
    default: { findOne: jest.fn(), findById: jest.fn() }
}));

const mockedVerify = verifyGoogleIdToken as jest.Mock;

describe('Auth Service - Unit Tests', () => {
    beforeEach(() => jest.clearAllMocks());

    describe('googleLogin', () => {
        it('returns error when no token is provided', async () => {
            const result = await authService.googleLogin('');

            expect(result).toEqual({ status: false, message: 'Missing token' });
        });

        it('returns error when google email is not verified', async () => {
            mockedVerify.mockResolvedValue({ email_verified: false, email: 'test@test.com' });

            const result = await authService.googleLogin('some-token');

            expect(result).toEqual({ status: false, message: 'Email not verified' });
        });

        it('returns token on successful login for existing user', async () => {
            mockedVerify.mockResolvedValue({
                email_verified: true,
                email: 'user@gmail.com',
                given_name: 'Test',
                family_name: 'User',
                name: 'Test User'
            });

            const mockUser = {
                _id: 'userId1',
                email: 'user@gmail.com',
                firstname: 'Test',
                lastname: 'User',
                role: { role: 'employee' }
            };

            (User.findOne as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue(mockUser)
                    })
                })
            });

            const result = await authService.googleLogin('valid-token');

            expect(result.status).toBe(true);
            expect(result.token).toBeDefined();
        });
    });

    describe('demoLogin', () => {
        it('returns error when role does not exist in DB', async () => {
            (Role.findOne as jest.Mock).mockResolvedValue(null);

            const result = await authService.demoLogin('admin');

            expect(result).toEqual({ status: false, message: 'Role admin not found' });
        });

        it('returns token for existing demo user', async () => {
            const mockRole = { _id: 'roleId1', role: 'employee' };
            (Role.findOne as jest.Mock).mockResolvedValue(mockRole);

            const mockUser = {
                _id: 'userId2',
                email: 'demo-employee@demo.com',
                firstname: 'Demo',
                lastname: 'Employee',
                role: { role: 'employee' }
            };

            (User.findOne as jest.Mock).mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    lean: jest.fn().mockReturnValue({
                        exec: jest.fn().mockResolvedValue(mockUser)
                    })
                })
            });

            const result = await authService.demoLogin('employee');

            expect(result.status).toBe(true);
            expect(result.token).toBeDefined();
        });
    });
});
