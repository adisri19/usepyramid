import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAdminService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseAdminService.name);

  onModuleInit() {
    if (!getApps().length) {
      try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
          const serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY,
          );
          initializeApp({
            credential: cert(serviceAccount),
            projectId: 'usepyramid',
          });
          this.logger.log('Firebase Admin initialized with service account key');
        } else {
          initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || 'usepyramid',
          });
          this.logger.log(
            `Firebase Admin initialized with projectId: ${
              process.env.FIREBASE_PROJECT_ID || 'usepyramid'
            }`,
          );
        }
      } catch (err: any) {
        this.logger.error('Failed to initialize Firebase Admin', err);
      }
    }
  }

  async verifyToken(idToken: string): Promise<DecodedIdToken> {
    return getAuth().verifyIdToken(idToken);
  }
}
