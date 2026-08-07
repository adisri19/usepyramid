import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { WorkspacesService } from '../workspaces/workspaces.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly workspacesService: WorkspacesService,
    private readonly jwtService: JwtService,
  ) {}

  async createGuestSession() {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const guestUser = await this.usersService.create({
      fullName: `Guest User ${randomSuffix}`,
      username: `guest_${randomSuffix}`,
      isGuest: true,
      provider: 'guest',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=guest_${randomSuffix}`,
    });

    const workspace = await this.workspacesService.create(
      `${guestUser.fullName}'s Workspace`,
      guestUser.id,
    );

    const payload: JwtPayload = {
      sub: guestUser.id,
      workspaceId: workspace.id,
      isGuest: true,
    };

    const token = this.jwtService.sign(payload);
    return { user: guestUser, token };
  }

  async validateGoogleUser(profile: any) {
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

    // Check if the user already has a workspace, otherwise create one
    const workspaces = await this.workspacesService.findByOwner(user.id);
    let workspace = workspaces[0];

    if (!workspace) {
      workspace = await this.workspacesService.create(
        `${user.fullName || 'My'}'s Workspace`,
        user.id,
      );
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      workspaceId: workspace.id,
      isGuest: false,
    };

    const token = this.jwtService.sign(payload);
    return { user, token };
  }
}
