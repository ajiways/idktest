import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import EnvConfig from './modules/config/env.config';
import { AuthModule } from './modules/administration/auth/auth.module';
import { UserModule } from './modules/administration/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from './modules/config/configuration.module';
import { ConfigurationService } from './modules/config/configuration.service';
import { APP_GUARD } from '@nestjs/core';
import { TokenGuard } from './common/guards';

const modules = [AuthModule, UserModule]

@Module({
  imports: [
    ConfigModule.forRoot({ load: [EnvConfig], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [ConfigurationService],
      useFactory: (config: ConfigurationService) => ({
        type: 'postgres',
        port: config.env.DB_PORT,
        database: config.env.DB_NAME,
        username: config.env.DB_USER,
        password: config.env.DB_PASSWORD,
        synchronize: false,
        logging: false,
        autoLoadEntities: true,
        entities: ["dist/**/*.entity{.ts,.js}"],
        migrations: ["dist/migrations/*{.ts,.js}"]
      })
    }),
    ...modules,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TokenGuard,
    },
  ],
})
export class AppModule {}
