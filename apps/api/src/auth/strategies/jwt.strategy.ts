import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['pyramid_session'];
          }
          if (!token && request) {
            token = request.headers['authorization']?.split(' ')?.[1];
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'default-jwt-secret-key-123456789',
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub || !payload.workspaceId) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
