import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { ConfigKeys } from './config.interface';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: string = process.env.NODE_ENV === "production" ? ".env" : ".env.development") {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get(key: ConfigKeys): string {
    return this.envConfig[key];
  }

  public isProduction() {
    return this.get(ConfigKeys.NODE_ENV) === "production";
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',

      host: this.get(ConfigKeys.DB_HOST) || "localhost",
      port: parseInt(this.get(ConfigKeys.DB_PORT)) || 5432,
      username: this.get(ConfigKeys.DB_USER) || "postgres",
      password: this.get(ConfigKeys.DB_PASSWORD),
      database: this.get(ConfigKeys.DB_NAME) || "dashboard_data_collector",

      entities: ['**/*.entity{.ts,.js}'],

      migrationsTableName: 'migration',

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
