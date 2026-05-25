import { Router } from 'express';
import * as userCtrl from '../controller/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { hasAdminRole } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { updateUserSchema } from '../validators/user.validator';

const router = Router();

router.get('/', authenticate, hasAdminRole, userCtrl.getUsers);
router.get('/:id', authenticate, hasAdminRole, userCtrl.getUserById);
router.patch('/:id', authenticate, hasAdminRole, validate(updateUserSchema), userCtrl.updateUser);
router.delete('/:id', authenticate, hasAdminRole, userCtrl.softDelete);

export default router;
