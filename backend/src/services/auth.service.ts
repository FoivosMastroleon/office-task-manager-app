import User from '../models/user.model';
import Role, { IRole } from '../models/role.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { verifyGoogleIdToken } from '../utils/googleVerify';
import { CreateUserDTO } from '../dto/user.dto';
import * as userDAO from '../dao/user.dao';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = '1h';
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');

export const register = async (payload: CreateUserDTO) => {
    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, SALT_ROUNDS);
    }

    let employeeRole = await Role.findOne({ role: 'employee' });
    if (!employeeRole) {
        employeeRole = await Role.create({ role: 'employee', description: 'Default role', active: true });
    }

    return await userDAO.createUser({ ...payload, role: employeeRole._id });
};

export const login = async (username: string, password: string) => {
    const user = await User.findOne({ username }).populate('role').lean().exec();
    if (!user || !user.password) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    const payload = { userId: user._id, email: user.email, role: ((user.role as unknown) as IRole).role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { user, token };
};

export const googleLogin = async (idToken: string) => {
    try {
        if (!idToken) return { status: false, message: 'Missing token' };

        const googleUser = await verifyGoogleIdToken(idToken);

        if (!googleUser.email_verified) return { status: false, message: 'Email not verified' };

        let user = await User.findOne({ email: googleUser.email }).populate('role').lean().exec();

        if (!user) {
            let employeeRole = await Role.findOne({ role: 'employee' });
            if (!employeeRole) {
                employeeRole = await Role.create({ role: 'employee', description: 'Default role', active: true });
            }

            const randomPassword = await bcrypt.hash(crypto.randomBytes(16).toString('hex'), SALT_ROUNDS);

            const newUser = await userDAO.createUser({
                username: googleUser.email,
                email: googleUser.email,
                firstname: googleUser.name,
                password: randomPassword,
                role: employeeRole._id,
                department: '',
                position: ''
            });

            user = await User.findById(newUser._id).populate('role').lean().exec();
        }

        if (!user) return { status: false, message: 'Could not create user' };

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: ((user.role as unknown) as IRole).role },
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
