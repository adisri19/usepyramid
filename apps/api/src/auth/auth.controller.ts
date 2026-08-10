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
    return { user, token };
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
    return { user, token };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirects to Google login page
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: any, @Res() res: any) {
    const { token } = req.user;
    this.setCookie(res, token);
    const frontendUrl = (this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000').replace(/\/$/, '');
    res.redirect(`${frontendUrl}/tasks?token=${token}`);
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res: any) {
    res.clearCookie('pyramid_session', {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      path: '/',
    });
    return { ok: true };
  }

  private setCookie(res: any, token: string) {
    const isLocalhost = Boolean(process.env.FRONTEND_URL?.includes('localhost') || !process.env.FRONTEND_URL);

    res.cookie('pyramid_session', token, {
      httpOnly: true,
      sameSite: isLocalhost ? 'lax' : 'none',
      secure: !isLocalhost,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }
}
