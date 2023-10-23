import { ConfigService } from '@nestjs/config';
import { EnvironmentConfig } from './env.config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) { }

  private getKey<T>(key: string) {
    const value = this.configService.get<T>(key);
    if (value === undefined)
      throw new Error(`Missing property ${key} in configuration object.`);
    return value;
  }

  get env(): EnvironmentConfig {
    return this.getKey<EnvironmentConfig>('testapp-env');
  }
}
