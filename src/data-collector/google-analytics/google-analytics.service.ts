import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { google } from 'googleapis';
import { ConfigService } from '../../config/config.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoogleAnalyticsRecord } from '../../model/googleAnalyticsRecord.entity';
import { ConfigKeys } from '../../config/config.interface';
import path from 'path';

@Injectable()
export class GoogleAnalyticsService {
  private readonly logger = new Logger(GoogleAnalyticsService.name);

  constructor(
    @InjectRepository(GoogleAnalyticsRecord)
    private readonly googleAnalyticsRepository: Repository<GoogleAnalyticsRecord>,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async googleAnalyticsCron() {
    this.logger.debug('#googleAnalyticsCron');

    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../../../.env.google_api_jwt.json'),
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    const client = await auth.getClient();

    const analyticsIds = this.configService.get(ConfigKeys.GOOGLE_ANALYTICS_IDS).split(',');

    for (const id of analyticsIds) {
      const response = await google.analyticsreporting({ version: 'v4', auth: client }).reports.batchGet({
        requestBody: {
          reportRequests: [
            {
              viewId: id,
              dateRanges: [
                {
                  startDate: 'TODAY',
                  endDate: 'TODAY',
                },
              ],
              metrics: [
                {
                  expression: 'ga:sessions',
                },
              ],
            },
          ],
        },
      });

      // response.data.reports[0].data?.totals;

      // await this.googleAnalyticsRepository.insert();
    }

    this.logger.debug(`googleAnalyticsRecords count: ${await this.googleAnalyticsRepository.count()}`);
  }
}
