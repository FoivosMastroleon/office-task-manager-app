import { Router } from 'express';
import * as authCtrl from '../controller/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema } from '../validators/user.validator';

const router = Router();

/**
 * @openapi
 * /auth/register:
 *  post:
 *    summary: Register a new user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *              firstname:
 *                type: string
 *              lastname:
 *                type: string
 *              email:
 *                type: string
 *              department:
 *                type: string
 *              position:
 *                type: string
 *    responses:
 *      201:
 *        description: User registered successfully
 *      400:
 *        description: Validation error
 */
router.post('/register', validate(createUserSchema.omit({ role: true })), authCtrl.register);

/**
 * @openapi
 * /auth/login:
 *  post:
 *    summary: User login
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: User logged in successfully
 *      401:
 *        description: Invalid credentials
 */
router.post('/login', authCtrl.login);

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
