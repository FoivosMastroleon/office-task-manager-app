import { Schema, model, Document, Types } from 'mongoose';


export interface ITask  extends Document {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    status: 'todo' | 'working_on_it' | 'done';
    board: Types.ObjectId;
    isActive: boolean;
    assignedTo: Types.ObjectId;
    assignedBy: Types.ObjectId;
    dueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema: Schema = new Schema<ITask>({
    title: { type: String, required: true },
    description: String,
    status: {
        type: String,
        enum: ['todo', 'working_on_it', 'done'],
        default: 'todo',
        required: true
    
    },
    isActive: { type: Boolean, default: true },
    board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
    assignedTo: { type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true},

    assignedBy: { type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true },

    dueDate: Date
}, {
    timestamps: true,
    collection: 'tasks'
    

})

export default model<ITask>('Task', TaskSchema);