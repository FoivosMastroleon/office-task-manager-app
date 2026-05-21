import {Schema, model, Document, Types} from 'mongoose';

export interface IRole extends Document {
    _id: Types.ObjectId;
    role: string;
    description?: string;
    active: boolean;
}

const RoleSchema: Schema = new Schema<IRole>({
    role: { type: String, required: true, unique: true },
    //'admin', 'manager', 'employee'
    
    description: String,
    active: { type: Boolean, default: true }
}, { 
    timestamps: true,
    collection: 'roles'
 });

 export default model<IRole>("Role", RoleSchema);