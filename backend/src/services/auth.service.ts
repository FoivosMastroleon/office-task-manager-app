import User from '../models/user.model';
import Role, { IRole } from '../models/role.model';
import jwt from 'jsonwebtoken';
import { verifyGoogleIdToken } from '../utils/googleVerify';
import * as userDAO from '../dao/user.dao';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '1h';
const ALLOWED_DOMAIN = process.env.ALLOWED_DOMAIN || '';

export const googleLogin = async (idToken: string) => {
    try {
        if (!idToken) return { status: false, message: 'Missing token' };

        const googleUser = await verifyGoogleIdToken(idToken);

        if (!googleUser.email_verified) return { status: false, message: 'Email not verified' };

        if (ALLOWED_DOMAIN && !googleUser.email.endsWith(`@${ALLOWED_DOMAIN}`)) {
            return { status: false, message: 'Email domain not allowed' };
        }

        let user = await User.findOne({ email: googleUser.email }).populate('role', 'role description').lean().exec();

        if (!user) {
            let employeeRole = await Role.findOne({ role: 'employee' });
            if (!employeeRole) {
                employeeRole = await Role.create({ role: 'employee', description: 'Default role' });
            }

            const newUser = await userDAO.createUser({
                username: googleUser.email,
                email: googleUser.email,
                firstname: googleUser.given_name ?? googleUser.name,
                lastname: googleUser.family_name,
                role: employeeRole._id,
            });

            user = await User.findById(newUser._id).populate('role', 'role description').lean().exec();
        }

        if (!user) return { status: false, message: 'Could not create user' };

        const token = jwt.sign(
    { userId: user._id, email: user.email, role: ((user.role as unknown) as IRole).role, firstname: user.firstname, lastname: user.lastname },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
        );


        return { status: true, token };

    } catch (err) {
        console.log('Error in google auth', err);
        return { status: false, message: 'Invalid Google Token' };
    }
};

export const getMe = async (userId: string) => {
    return await userDAO.findById(userId);
};
