import { Model } from 'mongoose';
import { Workspace } from './schemas/workspace.schema';
export declare class WorkspacesService {
    private workspaceModel;
    constructor(workspaceModel: Model<Workspace>);
    create(name: string, ownerId: string): Promise<Workspace>;
    findByOwner(ownerId: string): Promise<Workspace[]>;
    findOne(id: string): Promise<Workspace | null>;
    delete(id: string): Promise<any>;
}
