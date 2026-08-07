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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/current-user.decorator");
const jwt_payload_interface_1 = require("../auth/jwt-payload.interface");
const workspaces_service_1 = require("./workspaces.service");
let WorkspacesController = class WorkspacesController {
    workspacesService;
    constructor(workspacesService) {
        this.workspacesService = workspacesService;
    }
    async getMyWorkspaces(user) {
        return this.workspacesService.findByOwner(user.sub);
    }
    async createWorkspace(user, name) {
        return this.workspacesService.create(name || 'New Workspace', user.sub);
    }
    async deleteWorkspace(id, user) {
        const ws = await this.workspacesService.findOne(id);
        if (!ws) {
            return { ok: true };
        }
        if (ws.ownerId.toString() !== user.sub) {
            throw new common_1.ForbiddenException('You do not own this workspace');
        }
        await this.workspacesService.delete(id);
        return { ok: true };
    }
};
exports.WorkspacesController = WorkspacesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwt_payload_interface_1.JwtPayload]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getMyWorkspaces", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [jwt_payload_interface_1.JwtPayload, String]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "createWorkspace", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, jwt_payload_interface_1.JwtPayload]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "deleteWorkspace", null);
exports.WorkspacesController = WorkspacesController = __decorate([
    (0, common_1.Controller)('workspaces'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [workspaces_service_1.WorkspacesService])
], WorkspacesController);
//# sourceMappingURL=workspaces.controller.js.map