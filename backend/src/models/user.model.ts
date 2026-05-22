import { Document, model, Schema, Types } from 'mongoose';



export interface IUser extends Document {
    username: string;
    password?: string;
    firstname: string;
    lastname: string;
    googleId?: string;
    email: string;
    role: Types.ObjectId;
    department: string;
    position: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    firstname: String,
    lastname: String,
    googleId: String,
    email: { type: String, unique: true },
    role: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
    department: String,
    position: String,
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model<IUser>("User", UserSchema);
