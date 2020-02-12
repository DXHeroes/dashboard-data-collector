import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubRecord } from '../model/githubRecord.entity';
import { GithubService } from './github/github.service';
import { GoogleAnalyticsService } from './google-analytics/google-analytics.service';
import { GoogleAnalyticsRecord } from '../model/googleAnalyticsRecord.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GithubRecord, GoogleAnalyticsRecord])],
  providers: [GithubService, GoogleAnalyticsService],
})
export class DataCollectorModule {}
