import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyGoogleIdToken } from '../utils/googleVerify';

const JWT_SECRET = process.env.JWT_SECRET  || 'changeme';
const JWT_EXPIRES_IN = '1h';

export const login = async (username: string, password: string) => {
    const user = await User.findOne({username: username}).populate('role').lean().exec();
    if (!user || !user.password) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

   const payload = { userId: user._id, email: user.email, role: (user.role as any).role };


    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return { user, token };

}

export const googleLogin = async(idToken: string) =>{
  try {
    if (!idToken){
      return {status: false, message: "Missing token"}
    }

    const googleUser = await verifyGoogleIdToken(idToken);

    if (!googleUser.email_verified){
      return {status: false, message: "Email not verified"}
    }

    const user = await User.findOne({ email: googleUser.email }).populate('role').lean().exec();
    if (!user) {
        console.log("User not exist", googleUser.email);
        return { status: false, message: "User not registered" };
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: (user.role as any).role
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    return { status: true, token };
       

  } catch (err) {
    console.log("Error in google auth", err);
    return {status: false, message: "Invalid Google Token"}
  }
}
    