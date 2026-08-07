import { Controller, Get, Post, Delete, Param, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { WorkspacesService } from './workspaces.service';

@Controller('workspaces')
@UseGuards(JwtAuthGuard)
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  async getMyWorkspaces(@CurrentUser() user: JwtPayload) {
    return this.workspacesService.findByOwner(user.sub);
  }

  @Post()
  async createWorkspace(
    @CurrentUser() user: JwtPayload,
    @Body('name') name: string,
  ) {
    return this.workspacesService.create(name || 'New Workspace', user.sub);
  }

  @Delete(':id')
  async deleteWorkspace(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    const ws = await this.workspacesService.findOne(id);
    if (!ws) {
      return { ok: true };
    }
    if (ws.ownerId.toString() !== user.sub) {
      throw new ForbiddenException('You do not own this workspace');
    }
    await this.workspacesService.delete(id);
    return { ok: true };
  }
}
