/* eslint-disable no-process-env */
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ConfigKeys } from './config.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GithubRecord } from '../model/githubRecord.entity';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string = process.env.NODE_ENV === 'production' ? '.env' : '.env.development') {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get(key: ConfigKeys): string {
    return this.envConfig[key];
  }

  isProduction() {
    return this.get(ConfigKeys.NODE_ENV) === 'production';
  }

  getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.get(ConfigKeys.DB_HOST) || 'localhost',
      port: parseInt(this.get(ConfigKeys.DB_PORT)) || 5432,
      username: this.get(ConfigKeys.DB_USER) || 'postgres',
      password: this.get(ConfigKeys.DB_PASSWORD),
      database: this.get(ConfigKeys.DB_NAME) || 'dashboard_data_collector',

      entities: [GithubRecord],

      migrationsTableName: 'migration',
      synchronize: true,

      migrations: ['src/migration/*.ts'],

      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),
    };
  }
}

const configService = new ConfigService();

export { configService };
