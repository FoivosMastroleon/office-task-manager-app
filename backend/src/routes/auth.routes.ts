import { Router } from 'express';
import * as authCtrl from '../controller/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);
router.post('/google-auth', authCtrl.googleLogin);
router.get('/me', authenticate, authCtrl.getMe);

export default router;
