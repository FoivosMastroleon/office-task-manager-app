import { Router } from 'express';
import * as authCtrl from '../controller/auth.controller';

const router = Router();

router.post('/login', authCtrl.login);

router.post('/google-auth', authCtrl.googleLogin);

export default router;