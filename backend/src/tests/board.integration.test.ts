import { TestServer } from './testSetup';
import boardRouter from '../routes/board.routes';
import User from '../models/user.model';
import Role from '../models/role.model';
import Board from '../models/board.model'; // ← στα imports
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const server = new TestServer();
server.app.use('/boards', boardRouter);

describe('Board API Tests', () => {
    let adminToken: string;
    let managerToken: string;
    let employeeToken: string;
    let boardId: string;


    beforeAll(async () => {
    await server.start();

    const adminRole = await Role.create({ role: 'admin', description: 'Administrator' });
    const managerRole = await Role.create({ role: 'manager', description: 'Manager' });
    const employeeRole = await Role.create({ role: 'employee', description: 'Employee' });

    const hash = await bcrypt.hash('123456', 10);

    const admin = await User.create({
        username: 'adminTest', password: hash, email: 'admin@test.com',
        firstname: 'Admin', lastname: 'Test', department: 'IT',
        position: 'Developer', role: adminRole._id
    });

    const manager = await User.create({
        username: 'managerTest', password: hash, email: 'manager@test.com',
        firstname: 'Manager', lastname: 'Test', department: 'IT',
        position: 'Manager', role: managerRole._id
    });

    const employee = await User.create({
        username: 'employeeTest', password: hash, email: 'employee@test.com',
        firstname: 'Employee', lastname: 'Test', department: 'IT',
        position: 'Employee', role: employeeRole._id
    });

    adminToken = jwt.sign(
        { userId: admin._id, email: admin.email, role: 'admin' },
        JWT_SECRET, { expiresIn: '1h' }
    );
    managerToken = jwt.sign(
        { userId: manager._id, email: manager.email, role: 'manager' },
        JWT_SECRET, { expiresIn: '1h' }
    );
    employeeToken = jwt.sign(
        { userId: employee._id, email: employee.email, role: 'employee' },
        JWT_SECRET, { expiresIn: '1h' }
    );

    const board = await Board.create({
        title: 'Test Board',
        description: 'Test Description',
        owner: admin._id,
        members: []
    });
    boardId = board._id.toString();
});

    afterAll(async () => await server.stop());

    test('GET /boards -> 401 without token', async () => {
        const res = await server.request.get('/boards');
        expect(res.status).toBe(401);
    });

    test('GET /boards -> 200 with admin token', async () => {
        const res = await server.request.get('/boards').set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /boards/:id -> 200 returns board', async () => {
        const res = await server.request.get(`/boards/${boardId}`).set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(boardId);
    });

    test('POST /boards -> 403 with employee token', async () => {
        const res = await server.request.post('/boards')
            .set('Authorization', `Bearer ${employeeToken}`)
            .send({ title: 'Employee Board' });
        expect(res.status).toBe(403);
    });

    test('POST /boards -> 201 with manager token', async () => {
        const res = await server.request.post('/boards')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({ title: 'Manager Board', description: 'Created by manager' });
        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Manager Board');
    });

    test('PUT /boards/:id -> 200 updates board', async () => {
        const res = await server.request.put(`/boards/${boardId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ title: 'Updated Board' });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Updated Board');
    });

    test('DELETE /boards/:id -> 200 soft delete with manager', async () => {
        const res = await server.request.delete(`/boards/${boardId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
    });

});
