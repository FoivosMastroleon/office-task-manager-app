import { Router } from 'express';
import * as authCtrl from '../controller/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema } from '../validators/user.validator';

const router = Router();

router.post('/register', validate(createUserSchema.omit({ role: true })), authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/google-auth', authCtrl.googleLogin);
router.get('/me', authenticate, authCtrl.getMe);

export default router;
