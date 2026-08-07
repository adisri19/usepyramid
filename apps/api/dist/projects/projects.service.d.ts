import { Model } from 'mongoose';
import { Project } from './schemas/project.schema';
export declare class ProjectsService {
    private projectModel;
    constructor(projectModel: Model<Project>);
    create(data: any): Promise<Project>;
    findAll(workspaceId: string): Promise<Project[]>;
    findOne(id: string): Promise<Project | null>;
}
