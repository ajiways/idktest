import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigurationService } from './modules/config/configuration.service';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())

  const config = app.get(ConfigurationService)

  await app.listen(config.env.APP_PORT);
}
bootstrap();
