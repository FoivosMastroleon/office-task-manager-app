import { Router } from 'express';
import * as taskController from '../controller/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { hasAdminRole, hasAdminOrManagerRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, updateTaskStatusSchema } from '../validators/task.validator';

const router = Router();

/**
 * @openapi
 * /tasks:
 *  get:
 *    summary: Get tasks (filtered by role)
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of tasks
 */
router.get('/', authenticate, taskController.getTasks);

/**
 * @openapi
 * /tasks/all:
 *  get:
 *    summary: Get all tasks including inactive (admin only)
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of all tasks including inactive
 *      403:
 *        description: Access denied
 */
router.get('/all', authenticate, hasAdminRole, taskController.getTasksIncludingInactive);

/**
 * @openapi
 * /tasks/board/{boardId}:
 *  get:
 *    summary: Get tasks by board
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: boardId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: List of tasks for the board
 */
router.get('/board/:boardId', authenticate, taskController.getTasksByBoard);

/**
 * @openapi
 * /tasks/assignee/{userId}:
 *  get:
 *    summary: Get tasks by assignee
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: List of tasks assigned to the user
 */
router.get('/assignee/:userId', authenticate, taskController.getTasksByAssignee);

/**
 * @openapi
 * /tasks/{id}:
 *  get:
 *    summary: Get task by ID
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Task found
 *      404:
 *        description: Task not found
 */
router.get('/:id', authenticate, taskController.getTaskById);

/**
 * @openapi
 * /tasks:
 *  post:
 *    summary: Create a new task
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Task'
 *    responses:
 *      201:
 *        description: Task created successfully
 *      400:
 *        description: Validation error
 */
router.post('/', authenticate, hasAdminOrManagerRole, validate(createTaskSchema), taskController.createTask);

/**
 * @openapi
 * /tasks/{id}:
 *  put:
 *    summary: Replace task
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Task'
 *    responses:
 *      200:
 *        description: Task updated successfully
 *      404:
 *        description: Task not found
 */
router.put('/:id', authenticate, hasAdminOrManagerRole, validate(createTaskSchema), taskController.updateTask);

/**
 * @openapi
 * /tasks/{id}/status:
 *  patch:
 *    summary: Update task status
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *                enum: [todo, working_on_it, done]
 *    responses:
 *      200:
 *        description: Task status updated successfully
 */
router.patch('/:id/status', authenticate, validate(updateTaskStatusSchema), taskController.updateTaskStatus);

/**
 * @openapi
 * /tasks/{id}/restore:
 *  patch:
 *    summary: Restore a deleted task
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Task restored successfully
 */
router.patch('/:id/restore', authenticate, hasAdminRole, taskController.restoreTask);

/**
 * @openapi
 * /tasks/{id}:
 *  delete:
 *    summary: Soft delete task
 *    tags: [Tasks]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Task deleted successfully
 *      404:
 *        description: Task not found
 */
router.delete('/:id', authenticate, hasAdminRole, taskController.deleteTask);

export default router;
