import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { CommentsService } from './comments.service';

@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getComments(@Param('taskId') taskId: string) {
    return this.commentsService.findByTask(taskId);
  }

  @Post()
  async addComment(
    @Param('taskId') taskId: string,
    @CurrentUser() user: JwtPayload,
    @Body('body') body: string,
  ) {
    return this.commentsService.create(taskId, user.sub, body);
  }
}
