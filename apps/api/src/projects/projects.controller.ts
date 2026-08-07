import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { ProjectsService } from './projects.service';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getMyProjects(@CurrentUser() user: JwtPayload) {
    return this.projectsService.findAll(user.workspaceId);
  }

  @Post()
  async createProject(
    @CurrentUser() user: JwtPayload,
    @Body() body: { name: string; priority?: string; lead?: string; dueDate?: string },
  ) {
    return this.projectsService.create({
      ...body,
      workspace: user.workspaceId as any,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    });
  }
}
