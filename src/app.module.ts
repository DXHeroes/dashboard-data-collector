import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { configService } from './config/config.service';
import { DataCollectorModule } from './data-collector/data-collector.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [TypeOrmModule.forRoot(configService.getTypeOrmConfig()), ScheduleModule.forRoot(), ConfigModule, DataCollectorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
