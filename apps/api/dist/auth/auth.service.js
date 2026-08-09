"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const workspaces_service_1 = require("../workspaces/workspaces.service");
let AuthService = class AuthService {
    usersService;
    workspacesService;
    jwtService;
    constructor(usersService, workspacesService, jwtService) {
        this.usersService = usersService;
        this.workspacesService = workspacesService;
        this.jwtService = jwtService;
    }
    async createGuestSession() {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const guestUser = await this.usersService.create({
            fullName: `Guest User ${randomSuffix}`,
            username: `guest_${randomSuffix}`,
            isGuest: true,
            provider: 'guest',
            avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=guest_${randomSuffix}`,
        });
        const workspace = await this.workspacesService.create(`${guestUser.fullName}'s Workspace`, guestUser.id);
        const payload = {
            sub: guestUser.id,
            workspaceId: workspace.id,
            isGuest: true,
        };
        const token = this.jwtService.sign(payload);
        return { user: guestUser, token };
    }
    async validateGoogleUser(profile) {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            throw new Error('Google account must have an email address');
        }
        let user = await this.usersService.findByEmail(email);
        if (!user) {
            const username = email.split('@')[0] + '_' + Math.floor(100 + Math.random() * 900);
            user = await this.usersService.create({
                email,
                fullName: profile.displayName || profile.name?.givenName,
                username,
                avatarUrl: profile.photos?.[0]?.value || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.displayName}`,
                isGuest: false,
                provider: 'google',
            });
        }
        const workspaces = await this.workspacesService.findByOwner(user.id);
        let workspace = workspaces[0];
        if (!workspace) {
            workspace = await this.workspacesService.create(`${user.fullName || 'My'}'s Workspace`, user.id);
        }
        const payload = {
            sub: user.id,
            email: user.email,
            workspaceId: workspace.id,
            isGuest: false,
        };
        const token = this.jwtService.sign(payload);
        return { user, token };
    }
    async validateFirebaseUser(decoded) {
        const email = decoded.email;
        if (!email) {
            throw new Error('Firebase account must have an email address');
        }
        let user = await this.usersService.findByEmail(email);
        if (!user) {
            const username = email.split('@')[0] + '_' + Math.floor(100 + Math.random() * 900);
            user = await this.usersService.create({
                email,
                fullName: decoded.name || email.split('@')[0],
                username,
                avatarUrl: decoded.picture ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${decoded.name || email}`,
                isGuest: false,
                provider: 'google',
            });
        }
        const workspaces = await this.workspacesService.findByOwner(user.id);
        let workspace = workspaces[0];
        if (!workspace) {
            workspace = await this.workspacesService.create(`${user.fullName || 'My'}'s Workspace`, user.id);
        }
        const payload = {
            sub: user.id,
            email: user.email,
            workspaceId: workspace.id,
            isGuest: false,
        };
        const token = this.jwtService.sign(payload);
        return { user, token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        workspaces_service_1.WorkspacesService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map