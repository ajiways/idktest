import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigurationModule } from '../../config/configuration.module';
import { RefreshTokenStrategy, TokenStrategy } from './strategies';

@Module({
  imports: [
    UserModule,
    ConfigurationModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenStrategy, RefreshTokenStrategy],
})
export class AuthModule { }
