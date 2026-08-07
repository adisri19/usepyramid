import { JwtPayload } from '../auth/jwt-payload.interface';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: JwtPayload): Promise<import("./schemas/user.schema").User | null>;
    updateProfile(user: JwtPayload, updateData: {
        fullName?: string;
        title?: string;
        username?: string;
        avatarUrl?: string;
    }): Promise<import("./schemas/user.schema").User | null>;
}
