import { TestServer } from './testSetup';
import taskRouter from '../routes/task.routes';
import User from '../models/user.model';
import Role from '../models/role.model';
import Board from '../models/board.model';
import Task from '../models/task.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

const server = new TestServer();
server.app.use('/tasks', taskRouter);

describe('Task API Tests', () => { 
    let adminToken: string;
    let managerToken: string;
    let employeeToken: string;
    let boardId: string;
    let taskId: string;
    let adminId: string;
    let managerId: string;

    beforeAll(async () => {
        await server.start();

        const adminRole = await Role.create({ role: 'admin', description: 'Administrator' });
        const managerRole = await Role.create({ role: 'manager', description: 'Manager' });
        const employeeRole = await Role.create({ role: 'employee', description: 'Employee' });

        const hash = await bcrypt.hash('123456', 10);
        const admin = await User.create({
            username: 'adminTaskTest', password: hash, email: 'admin@test.com',
            firstname: 'Admin', lastname: 'Test', department: 'IT',
            position: 'Developer', role: adminRole._id
        });
        const manager = await User.create({
            username: 'managerTaskTest', password: hash, email: 'manager@test.com',
            firstname: 'Manager', lastname: 'Test', department: 'IT',
            position: 'Manager', role: managerRole._id
        });
        const employee = await User.create({
            username: 'employeeTaskTest', password: hash, email: 'employee@test.com',
            firstname: 'Employee', lastname: 'Test', department: 'IT',
            position: 'Employee', role: employeeRole._id
        }); 
        adminId = admin._id.toString();
        managerId = manager._id.toString();

        adminToken = jwt.sign({ userId: admin._id, role: adminRole.role }, JWT_SECRET, { expiresIn: '1h' });
        managerToken = jwt.sign({ userId: manager._id, role: managerRole.role }, JWT_SECRET, { expiresIn: '1h' });
        employeeToken = jwt.sign({ userId: employee._id, role: employeeRole.role }, JWT_SECRET, { expiresIn: '1h' });

        const board = await Board.create({title: 'Test Board', owner: admin._id, members: []
   });

    boardId = board._id.toString();

        const task = await Task.create({title: 'Test Task', description: 'Task for testing',status: 'todo', board: board._id,assignedTo: admin._id, assignedBy: admin._id
   });
    taskId = task._id.toString();
    });

    afterAll(async () => await server.stop());      

    test('GET /tasks -> 401 without token', async () => {
        const res = await server.request.get('/tasks');
        expect(res.status).toBe(401);
    });
    test('GET /tasks -> 200 with admin token', async () => {
        const res = await server.request.get('/tasks').set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    }); 
    test('GET /tasks/:id -> 200 returns task', async () => {
        const res = await server.request.get(`/tasks/${taskId}`).set('Authorization', `Bearer ${adminToken}`);
        expect(res.status).toBe(200);
        expect(res.body.id).toBe(taskId);
    });
    test('POST /tasks -> 403 with employee token', async () => {
        const res = await server.request.post('/tasks')
            .set('Authorization', `Bearer ${employeeToken}`)
            .send({ title: 'Employee Task' });
        expect(res.status).toBe(403);
    });
    test('POST /tasks -> 201 with manager token', async () => {
        const res = await server.request.post('/tasks')
            .set('Authorization', `Bearer ${managerToken}`)
            .send({
                title: 'Manager Task created',
                description: 'Created by manager test',
                board: boardId,
                assignedTo: adminId,
                assignedBy: managerId
            });
        expect(res.status).toBe(201);
    });
    test('PUT /tasks/:id -> 200 updates task', async () => {
        const res = await server.request.put(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'Updated Task title here',
                board: boardId,
                assignedTo: adminId,
                assignedBy: adminId
            });
        expect(res.status).toBe(200);
        expect(res.body.title).toBe('Updated Task title here');
    });
    test('DELETE /tasks/:id -> 200 soft delete with manager', async () => {
        const res = await server.request.delete(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${managerToken}`);
        expect(res.status).toBe(200);
    });
});