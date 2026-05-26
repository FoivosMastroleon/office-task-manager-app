import { Router } from 'express';
import * as taskController from '../controller/task.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { hasAdminRole, hasAdminOrManagerRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createTaskSchema, updateTaskStatusSchema } from '../validators/task.validator';

const router = Router();

router.get('/', authenticate, taskController.getTasks);
router.get('/all', authenticate, hasAdminRole, taskController.getTasksIncludingInactive);
router.get('/board/:boardId', authenticate, taskController.getTasksByBoard);
router.get('/assignee/:userId', authenticate, taskController.getTasksByAssignee);
router.get('/:id', authenticate, taskController.getTaskById);
router.post('/', authenticate, hasAdminOrManagerRole, validate(createTaskSchema), taskController.createTask);
router.put('/:id', authenticate, hasAdminOrManagerRole, validate(createTaskSchema), taskController.updateTask);
router.patch('/:id/status', authenticate, validate(updateTaskStatusSchema), taskController.updateTaskStatus);
router.patch('/:id/restore', authenticate, hasAdminRole, taskController.restoreTask);
router.delete('/:id', authenticate, hasAdminRole, taskController.deleteTask);

export default router; 