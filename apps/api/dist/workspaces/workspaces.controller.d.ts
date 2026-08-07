import { JwtPayload } from '../auth/jwt-payload.interface';
import { WorkspacesService } from './workspaces.service';
export declare class WorkspacesController {
    private readonly workspacesService;
    constructor(workspacesService: WorkspacesService);
    getMyWorkspaces(user: JwtPayload): Promise<import("./schemas/workspace.schema").Workspace[]>;
    createWorkspace(user: JwtPayload, name: string): Promise<import("./schemas/workspace.schema").Workspace>;
    deleteWorkspace(id: string, user: JwtPayload): Promise<{
        ok: boolean;
    }>;
}
