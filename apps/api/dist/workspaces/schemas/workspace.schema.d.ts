import { Document, Types } from 'mongoose';
export declare class Workspace extends Document {
    name: string;
    ownerId: Types.ObjectId;
}
export declare const WorkspaceSchema: import("mongoose").Schema<Workspace, import("mongoose").Model<Workspace, any, any, any, Document<unknown, any, Workspace, any, {}> & Workspace & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Workspace, Document<unknown, {}, import("mongoose").FlatRecord<Workspace>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Workspace> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
