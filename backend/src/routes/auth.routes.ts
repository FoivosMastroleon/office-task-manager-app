import { Router } from 'express';
import * as authCtrl from '../controller/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /auth/google-auth:
 *  post:
 *    summary: Google OAuth login
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *    responses:
 *      200:
 *        description: User logged in with Google
 *      401:
 *        description: Invalid Google token
 */
router.post('/google-auth', authCtrl.googleLogin);

/**
 * @openapi
 * /auth/me:
 *  get:
 *    summary: Get current logged in user
 *    tags: [Auth]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Current user data
 *      401:
 *        description: Unauthorized
 */
router.get('/me', authenticate, authCtrl.getMe);

export default router;
