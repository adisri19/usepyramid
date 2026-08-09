import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { FirebaseAdminService } from './firebase-admin.service';
export declare class AuthController {
    private readonly authService;
    private readonly configService;
    private readonly firebaseAdminService;
    constructor(authService: AuthService, configService: ConfigService, firebaseAdminService: FirebaseAdminService);
    guestLogin(res: any): Promise<{
        user: import("../users/schemas/user.schema").User;
    }>;
    firebaseLogin(idToken: string, res: any): Promise<{
        user: import("../users/schemas/user.schema").User;
    }>;
    googleAuth(): Promise<void>;
    googleCallback(req: any, res: any): Promise<void>;
    logout(res: any): Promise<{
        ok: boolean;
    }>;
    private setCookie;
}
