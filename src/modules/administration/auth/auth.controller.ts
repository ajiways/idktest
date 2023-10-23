import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
import { Response } from 'express';
import { REFRESH_TOKEN_KEY } from '../../../common/constants';
import { LoginDto } from './dto';
import { Public } from '../../../common/decorators/is-public.decorator';
import { RefreshTokenGuard } from '../../../common/guards';
import { GetUser } from '../../../common/decorators/get-user';
import { UserPayloadWithRefreshToken } from './types';

@Controller('/auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @Public()
  @Post('/sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() arg: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, token } = await this.authService.register(arg);

    this.setRefreshToken(res, refreshToken);

    return {
      token,
      message: 'Success'
    }
  }

  @Public()
  @Post('/sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() arg: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, token } = await this.authService.login(arg);

    this.setRefreshToken(res, refreshToken);

    return {
      token,
      message: 'Success'
    }
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('/refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@GetUser() payload: UserPayloadWithRefreshToken, @Res({ passthrough: true }) res: Response) {
    const { refreshToken, token } = await this.authService.refresh(payload)

    this.setRefreshToken(res, refreshToken);

    return {
      token,
      message: 'Success'
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Get('/logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(REFRESH_TOKEN_KEY);
  }

  private setRefreshToken(res: Response, token: string) {
    res.cookie(REFRESH_TOKEN_KEY, token, { httpOnly: true });
  }
}
