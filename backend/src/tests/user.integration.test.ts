import { TestServer } from './testSetup';
import userRouter from '../routes/user.routes';
import User from '../models/user.model';
import Role from '../models/role.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const server = new TestServer();
server.app.use('/users', userRouter);

describe('User API Tests', () => {
    let token: string;
    let userId: string;

    beforeAll(async () => {
        await server.start();

        const adminRole = await Role.create({ role: 'admin', description: 'Administrator' });

        const hash = await bcrypt.hash('123456', 10);
        const user = await User.create({
            username: 'adminTest',
            password: hash,
            email: 'admin@test.com',
            firstname: 'Admin',
            lastname: 'Test',
            department: 'IT',
            position: 'Developer',
            role: adminRole._id
        });

        userId = user._id.toString();
        token = jwt.sign(
            { userId: user._id, email: user.email, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
    });

    afterAll(async () => await server.stop());

    test('GET /users -> returns 401 without token', async () => {
    const res = await server.request.get('/users');
    expect(res.status).toBe(401);
});

test('GET /users -> returns 403 with employee token', async () => {
    const employeeRole = await Role.create({ role: 'employee', description: 'Employee' });
    const hash = await bcrypt.hash('123456', 10);
    const emp = await User.create({
        username: 'empTest', password: hash, email: 'emp@test.com',
        firstname: 'Emp', lastname: 'Test', department: 'IT', position: 'Junior',
        role: employeeRole._id
    });
    const empToken = jwt.sign(
        { userId: emp._id, email: emp.email, role: 'employee' },
        JWT_SECRET, { expiresIn: '1h' }
    );
    const res = await server.request.get('/users').set('Authorization', `Bearer ${empToken}`);
    expect(res.status).toBe(403);
});

test('GET /users -> returns 200 with admin token', async () => {
    const res = await server.request.get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
});

test('POST /users -> creates a new user', async () => {
    const adminRole = await Role.findOne({ role: 'admin' });
    const res = await server.request
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
            username: 'newUser',
            password: 'password123',
            email: 'new@test.com',
            firstname: 'New',
            lastname: 'User',
            department: 'IT',
            position: 'Developer',
            role: adminRole!._id.toString()
        });
    expect(res.status).toBe(201);
});

test('POST /users -> returns 400 validation error', async () => {
    const res = await server.request
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ username: 'ab' }); 
    expect(res.status).toBe(400);
});

test('GET /users/:id -> 200 returns user', async () => {
    const res = await server.request
        .get(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
});

test('GET /users/:id -> 404 unknown id', async () => {
    const res = await server.request
        .get('/users/000000000000000000000000')
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
});

test('PATCH /users/:id -> 200 update user', async () => {
    const res = await server.request
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ firstname: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.firstname).toBe('Updated');
});

test('DELETE /users/:id -> 200 soft delete', async () => {
    const res = await server.request
        .delete(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.isActive).toBe(false);
});


});
