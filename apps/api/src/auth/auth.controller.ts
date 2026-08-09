import { Controller, Get, Post, Res, UseGuards, Req, Body, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { FirebaseAdminService } from './firebase-admin.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly firebaseAdminService: FirebaseAdminService,
  ) {}

  @Post('guest')
  async guestLogin(@Res({ passthrough: true }) res: any) {
    const { user, token } = await this.authService.createGuestSession();
    this.setCookie(res, token);
    return { user };
  }

  @Post('firebase')
  async firebaseLogin(
    @Body('idToken') idToken: string,
    @Res({ passthrough: true }) res: any,
  ) {
    if (!idToken) {
      throw new BadRequestException('Firebase ID token is required');
    }

    const decoded = await this.firebaseAdminService.verifyToken(idToken);
    const { user, token } = await this.authService.validateFirebaseUser(decoded);
    this.setCookie(res, token);
    return { user };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirects to Google login page
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const { token } = req.user; // req.user contains the output from GoogleStrategy.validate()
    this.setCookie(res, token);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/tasks`);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: any) {
    res.clearCookie('pyramid_session', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    return { ok: true };
  }

  private setCookie(res: any, token: string) {
    res.cookie('pyramid_session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }
}
