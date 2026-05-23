import { Schema, model, Document, Types } from 'mongoose';

export interface IBoard extends Document {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    owner: Types.ObjectId;
    members: Types.ObjectId[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BoardSchema: Schema = new Schema<IBoard>({
    title: { type: String, required: true },
    description: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    collection: 'boards'
});

export default model<IBoard>("Board", BoardSchema);