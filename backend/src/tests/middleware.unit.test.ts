import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middlewares/auth.middleware';
import {
    hasAdminRole,
    hasManagerRole,
    hasEmployeeRole,
    hasAdminOrManagerRole
} from '../middlewares/role.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const mockRes = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockNext: NextFunction = jest.fn();

beforeEach(() => jest.clearAllMocks());

describe('Auth Middleware', () => {
    it('returns 401 when Authorization header is missing', () => {
        const req = { headers: {} } as Request;
        const res = mockRes();

        authenticate(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 401 when Authorization header does not start with Bearer', () => {
        const req = { headers: { authorization: 'Basic abc123' } } as Request;
        const res = mockRes();

        authenticate(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 401 when token is invalid', () => {
        const req = { headers: { authorization: 'Bearer invalidtoken' } } as Request;
        const res = mockRes();

        authenticate(req, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('calls next and sets req.user when token is valid', () => {
        const payload = { userId: 'u1', role: 'admin' };
        const token = jwt.sign(payload, JWT_SECRET);
        const req = { headers: { authorization: `Bearer ${token}` }, user: undefined } as any;
        const res = mockRes();

        authenticate(req, res, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(req.user.userId).toBe('u1');
    });
});

describe('Role Middleware', () => {
    describe('hasAdminRole', () => {
        it('calls next when user is admin', () => {
            const req = { user: { role: 'admin' } } as any;
            const res = mockRes();

            hasAdminRole(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
        });

        it('returns 403 when user is not admin', () => {
            const req = { user: { role: 'employee' } } as any;
            const res = mockRes();

            hasAdminRole(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('returns 401 when req.user is undefined', () => {
            const req = {} as any;
            const res = mockRes();

            hasAdminRole(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
        });
    });

    describe('hasManagerRole', () => {
        it('calls next when user is manager', () => {
            const req = { user: { role: 'manager' } } as any;
            const res = mockRes();

            hasManagerRole(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('returns 403 when user is not manager', () => {
            const req = { user: { role: 'admin' } } as any;
            const res = mockRes();

            hasManagerRole(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('hasEmployeeRole', () => {
        it('calls next when user is employee', () => {
            const req = { user: { role: 'employee' } } as any;
            const res = mockRes();

            hasEmployeeRole(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('returns 403 when user is not employee', () => {
            const req = { user: { role: 'admin' } } as any;
            const res = mockRes();

            hasEmployeeRole(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(403);
        });
    });

    describe('hasAdminOrManagerRole', () => {
        it('calls next when user is admin', () => {
            const req = { user: { role: 'admin' } } as any;
            const res = mockRes();

            hasAdminOrManagerRole(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('calls next when user is manager', () => {
            const req = { user: { role: 'manager' } } as any;
            const res = mockRes();

            hasAdminOrManagerRole(req, res, mockNext);

            expect(mockNext).toHaveBeenCalled();
        });

        it('returns 403 when user is employee', () => {
            const req = { user: { role: 'employee' } } as any;
            const res = mockRes();

            hasAdminOrManagerRole(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(403);
        });

        it('returns 401 when req.user is undefined', () => {
            const req = {} as any;
            const res = mockRes();

            hasAdminOrManagerRole(req, res, mockNext);

            expect(res.status).toHaveBeenCalledWith(401);
        });
    });
});
