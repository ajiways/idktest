import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserPayload } from '../../../../common/types/interfaces';
import { ConfigurationService } from '../../../config/configuration.service';
import { REFRESH_TOKEN_KEY } from '../../../../common/constants';
import { UserPayloadWithRefreshToken } from '../types';

function tokenExtractor(req: Request) {
  let token: string;

  if (req && req.cookies[REFRESH_TOKEN_KEY]) {
    token = req.cookies[REFRESH_TOKEN_KEY]
  }

  return token;
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigurationService) {
    super({
      jwtFromRequest: tokenExtractor,
      secretOrKey: config.env.JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: UserPayload): UserPayloadWithRefreshToken {
    const refreshToken = req.cookies[REFRESH_TOKEN_KEY];

    if (!refreshToken) {
      throw new ForbiddenException('No refresh token');
    }

    return {
      ...payload,
      refreshToken,
    };
  }
}
