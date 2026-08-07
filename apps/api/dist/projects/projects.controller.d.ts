import { JwtPayload } from '../auth/jwt-payload.interface';
import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    getMyProjects(user: JwtPayload): Promise<import("./schemas/project.schema").Project[]>;
    createProject(user: JwtPayload, body: {
        name: string;
        priority?: string;
        lead?: string;
        dueDate?: string;
    }): Promise<import("./schemas/project.schema").Project>;
}
