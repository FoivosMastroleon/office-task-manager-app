import { Router } from 'express';
import * as userCtrl from '../controller/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { hasAdminRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';

const router = Router();

/**
 * @openapi
 * /users:
 *  get:
 *    summary: Get all users
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of all users
 *      403:
 *        description: Access denied
 */
router.get('/', authenticate, hasAdminRole, userCtrl.getUsers);

/**
 * @openapi
 * /users:
 *  post:
 *    summary: Create a new user (admin only)
 *    tags: [Users]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      201:
 *        description: User created successfully
 *      400:
 *        description: Validation error
 */
router.post('/', authenticate, hasAdminRole, validate(createUserSchema), userCtrl.createUser);

/**
 * @openapi
 * /users/{id}:
 *  get:
 *    summary: Get user by ID
 *    tags: [Users]
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
 *        description: User found
 *      404:
 *        description: User not found
 */
router.get('/:id', authenticate, hasAdminRole, userCtrl.getUserById);

/**
 * @openapi
 * /users/{id}:
 *  patch:
 *    summary: Update user
 *    tags: [Users]
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
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: User updated successfully
 *      404:
 *        description: User not found
 */
router.patch('/:id', authenticate, hasAdminRole, validate(updateUserSchema), userCtrl.updateUser);

/**
 * @openapi
 * /users/{id}:
 *  delete:
 *    summary: Soft delete user
 *    tags: [Users]
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
 *        description: User deleted successfully
 *      404:
 *        description: User not found
 */
router.delete('/:id', authenticate, hasAdminRole, userCtrl.softDelete);

export default router;
