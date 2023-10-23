import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigurationService } from '../../config/configuration.service';
import { RegisterDto } from './dto';
import { UserService } from '../user/user.service';
import { compare, hash } from 'bcrypt';
import { UserEntity } from '../user/user.entity';
import { LoginDto } from './dto';
import { TokensResponse } from './interfaces/tokens-response';
import { UserPayloadWithRefreshToken } from './types';

@Injectable()
export class AuthService {
  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(ConfigurationService)
  private readonly configService: ConfigurationService;

  @Inject(UserService)
  private readonly userService: UserService;

  async register(dto: RegisterDto): Promise<TokensResponse> {
    dto.password = await hash(dto.password, 6);
    const user = await this.userService.createUser(dto);

    const { token, refreshToken } = await this.generateTokensPair(user);
    user.refreshToken = await hash(refreshToken, 6);
    await this.userService.updateUser(user);

    return { token, refreshToken };
  }

  async login(dto: LoginDto): Promise<TokensResponse> {
    const user = await this.userService.findOneBy({ email: dto.email })

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordMatch = await compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const { token, refreshToken } = await this.generateTokensPair(user);
    user.refreshToken = await hash(refreshToken, 6);
    await this.userService.updateUser(user);

    return { token, refreshToken };
  }

  async refresh(payload: UserPayloadWithRefreshToken): Promise<TokensResponse> {
    const user = await this.userService.findOneBy({ id: payload.id });

    const tokenMatches = await compare(payload.refreshToken, user.refreshToken);

    if (!tokenMatches) {
      throw new UnauthorizedException();
    }

    const { token, refreshToken } = await this.generateTokensPair(user);

    user.refreshToken = await hash(refreshToken, 6);

    await this.userService.updateUser(user);

    return { token, refreshToken }
  }

  private async generateTokensPair(user: UserEntity): Promise<TokensResponse> {
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.signAsync({ id: user.id }, {
        secret: this.configService.env.JWT_SECRET,
        expiresIn: this.configService.env.JWT_TOKEN_LIFETIME,
      }),
      await this.jwtService.signAsync({ id: user.id }, {
        secret: this.configService.env.JWT_REFRESH_SECRET,
        expiresIn: this.configService.env.JWT_REFRESH_TOKEN_LIFETIME,
      })
    ])

    return { token, refreshToken }
  }
}
