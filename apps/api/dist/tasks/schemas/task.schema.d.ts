import { Document, Types } from 'mongoose';
export declare class Task extends Document {
    title: string;
    description?: string;
    status: string;
    priority: string;
    assignee?: Types.ObjectId;
    reporter?: Types.ObjectId;
    project?: Types.ObjectId;
    workspace: Types.ObjectId;
    parentTask?: Types.ObjectId;
    labels: string[];
    dueDate?: Date;
    startDate?: Date;
}
export declare const TaskSchema: import("mongoose").Schema<Task, import("mongoose").Model<Task, any, any, any, Document<unknown, any, Task, any, {}> & Task & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Task, Document<unknown, {}, import("mongoose").FlatRecord<Task>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Task> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
