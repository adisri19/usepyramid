"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FirebaseAdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAdminService = void 0;
const common_1 = require("@nestjs/common");
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
let FirebaseAdminService = FirebaseAdminService_1 = class FirebaseAdminService {
    logger = new common_1.Logger(FirebaseAdminService_1.name);
    onModuleInit() {
        if (!(0, app_1.getApps)().length) {
            try {
                if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
                    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
                    (0, app_1.initializeApp)({
                        credential: (0, app_1.cert)(serviceAccount),
                        projectId: 'usepyramid',
                    });
                    this.logger.log('Firebase Admin initialized with service account key');
                }
                else {
                    (0, app_1.initializeApp)({
                        projectId: process.env.FIREBASE_PROJECT_ID || 'usepyramid',
                    });
                    this.logger.log(`Firebase Admin initialized with projectId: ${process.env.FIREBASE_PROJECT_ID || 'usepyramid'}`);
                }
            }
            catch (err) {
                this.logger.error('Failed to initialize Firebase Admin', err);
            }
        }
    }
    async verifyToken(idToken) {
        return (0, auth_1.getAuth)().verifyIdToken(idToken);
    }
};
exports.FirebaseAdminService = FirebaseAdminService;
exports.FirebaseAdminService = FirebaseAdminService = FirebaseAdminService_1 = __decorate([
    (0, common_1.Injectable)()
], FirebaseAdminService);
//# sourceMappingURL=firebase-admin.service.js.map