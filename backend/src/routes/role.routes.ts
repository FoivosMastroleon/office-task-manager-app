import { Router } from 'express';
import Role from '../models/role.model';
import { authenticate } from '../middlewares/auth.middleware';
import { hasAdminRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', authenticate, hasAdminRole, async (_req, res, next) => {
    try {
        const roles = await Role.find().lean().exec();
        res.status(200).json(roles);
    } catch (err) {
        next(err);
    }
});

export default router;
