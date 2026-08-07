import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: JwtPayload) {
    const userDoc = await this.usersService.findById(user.sub);
    return userDoc;
  }

  @Patch('me')
  async updateProfile(
     @CurrentUser() user: JwtPayload,
     @Body() updateData: { fullName?: string; title?: string; username?: string; avatarUrl?: string },
  ) {
    const updated = await this.usersService.update(user.sub, updateData);
    return updated;
  }
}
