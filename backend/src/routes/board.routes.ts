import { Router } from 'express';
import * as boardController from '../controller/board.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { hasAdminRole, hasAdminOrManagerRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';    
import { createBoardSchema } from '../validators/board.validator';

const router = Router();

router.get('/', authenticate, boardController.getBoards);
router.get('/all', authenticate, hasAdminRole, boardController.getBoardsIncludingInactive);
router.get('/:id', authenticate, boardController.getBoardById);
router.post('/', authenticate, hasAdminOrManagerRole, validate(createBoardSchema), boardController.createBoard);
router.put('/:id', authenticate, hasAdminOrManagerRole, validate(createBoardSchema), boardController.updateBoard);
router.delete('/:id', authenticate, hasAdminRole, boardController.deleteBoard);
router.patch('/:id/restore', authenticate, hasAdminRole, boardController.restoreBoard);
router.patch('/:boardId/add-member/:memberId', authenticate, hasAdminOrManagerRole, boardController.addMemberToBoard);  
router.patch('/:boardId/remove-member/:memberId', authenticate, hasAdminOrManagerRole, boardController.removeMemberFromBoard);

export default router; 