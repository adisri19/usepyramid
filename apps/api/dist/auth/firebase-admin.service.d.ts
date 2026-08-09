import { OnModuleInit } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
export declare class FirebaseAdminService implements OnModuleInit {
    private readonly logger;
    onModuleInit(): void;
    verifyToken(idToken: string): Promise<DecodedIdToken>;
}
