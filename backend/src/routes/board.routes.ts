import { Router } from 'express';
import * as boardController from '../controller/board.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { hasAdminRole, hasAdminOrManagerRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createBoardSchema } from '../validators/board.validator';

const router = Router();

/**
 * @openapi
 * /boards:
 *  get:
 *    summary: Get all boards (filtered by role)
 *    tags: [Boards]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of boards
 */
router.get('/', authenticate, boardController.getBoards);

/**
 * @openapi
 * /boards/all:
 *  get:
 *    summary: Get all boards including inactive (admin only)
 *    tags: [Boards]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: List of all boards including inactive
 *      403:
 *        description: Access denied
 */
router.get('/all', authenticate, hasAdminRole, boardController.getBoardsIncludingInactive);

/**
 * @openapi
 * /boards/{id}:
 *  get:
 *    summary: Get board by ID
 *    tags: [Boards]
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
 *        description: Board found
 *      404:
 *        description: Board not found
 */
router.get('/:id', authenticate, boardController.getBoardById);

/**
 * @openapi
 * /boards:
 *  post:
 *    summary: Create a new board
 *    tags: [Boards]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Board'
 *    responses:
 *      201:
 *        description: Board created successfully
 *      400:
 *        description: Validation error
 */
router.post('/', authenticate, hasAdminOrManagerRole, validate(createBoardSchema), boardController.createBoard);

/**
 * @openapi
 * /boards/{id}:
 *  put:
 *    summary: Replace board
 *    tags: [Boards]
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
 *            $ref: '#/components/schemas/Board'
 *    responses:
 *      200:
 *        description: Board updated successfully
 *      404:
 *        description: Board not found
 */
router.put('/:id', authenticate, hasAdminOrManagerRole, validate(createBoardSchema), boardController.updateBoard);

/**
 * @openapi
 * /boards/{id}:
 *  delete:
 *    summary: Soft delete board and its tasks
 *    tags: [Boards]
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
 *        description: Board deleted successfully
 *      404:
 *        description: Board not found
 */
router.delete('/:id', authenticate, hasAdminRole, boardController.deleteBoard);

/**
 * @openapi
 * /boards/{id}/restore:
 *  patch:
 *    summary: Restore a deleted board
 *    tags: [Boards]
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
 *        description: Board restored successfully
 */
router.patch('/:id/restore', authenticate, hasAdminRole, boardController.restoreBoard);

/**
 * @openapi
 * /boards/{boardId}/add-member/{memberId}:
 *  patch:
 *    summary: Add a member to a board
 *    tags: [Boards]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: boardId
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: memberId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Member added successfully
 */
router.patch('/:boardId/add-member/:memberId', authenticate, hasAdminOrManagerRole, boardController.addMemberToBoard);

/**
 * @openapi
 * /boards/{boardId}/remove-member/{memberId}:
 *  patch:
 *    summary: Remove a member from a board
 *    tags: [Boards]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: boardId
 *        required: true
 *        schema:
 *          type: string
 *      - in: path
 *        name: memberId
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Member removed successfully
 */
router.patch('/:boardId/remove-member/:memberId', authenticate, hasAdminOrManagerRole, boardController.removeMemberFromBoard);

export default router;
