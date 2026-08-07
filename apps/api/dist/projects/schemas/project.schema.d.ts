import { Document, Types } from 'mongoose';
export declare class Project extends Document {
    name: string;
    priority: string;
    lead?: Types.ObjectId;
    workspace: Types.ObjectId;
    dueDate?: Date;
}
export declare const ProjectSchema: import("mongoose").Schema<Project, import("mongoose").Model<Project, any, any, any, Document<unknown, any, Project, any, {}> & Project & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Project, Document<unknown, {}, import("mongoose").FlatRecord<Project>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Project> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
