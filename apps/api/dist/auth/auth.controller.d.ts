import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    guestLogin(res: any): Promise<{
        user: import("../users/schemas/user.schema").User;
    }>;
    googleAuth(): Promise<void>;
    googleCallback(req: any, res: any): Promise<void>;
    logout(res: any): Promise<{
        ok: boolean;
    }>;
    private setCookie;
}
