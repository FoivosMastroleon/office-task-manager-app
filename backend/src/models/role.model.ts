import {Schema, model, Document, Types} from 'mongoose';

export interface IRole extends Document {
    _id: Types.ObjectId;
    role: string;
    description?: string;
}

const RoleSchema: Schema = new Schema<IRole>({
    role: {
        type: String,
        enum: ['admin', 'manager', 'employee'],
        required: true,
        unique: true },
    description: String,
}, {
    collection: 'roles'
});

 export default model<IRole>("Role", RoleSchema); 