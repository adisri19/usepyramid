import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
export declare class AuthService {
    private readonly usersService;
    private readonly workspacesService;
    private readonly jwtService;
    constructor(usersService: UsersService, workspacesService: WorkspacesService, jwtService: JwtService);
    createGuestSession(): Promise<{
        user: import("../users/schemas/user.schema").User;
        token: string;
    }>;
    validateGoogleUser(profile: any): Promise<{
        user: import("../users/schemas/user.schema").User;
        token: string;
    }>;
}
