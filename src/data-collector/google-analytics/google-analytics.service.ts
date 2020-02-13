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

  @Cron(CronExpression.EVERY_2_HOURS)
  async googleAnalyticsCron() {
    this.logger.debug('#googleAnalyticsCron');

    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '../../../.env.google_api_jwt.json'),
      scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
    });
    const client = await auth.getClient();

    const analyticsIds = this.configService.get(ConfigKeys.GOOGLE_ANALYTICS_IDS).split(',');

    for (const id of analyticsIds) {
      // https://developers.google.com/analytics/devguides/reporting/core/v4/rest/v4/reports/batchGet#MetricType
      // https://www.ovrdrv.com/blog/ultimate-google-analytics-dimensions-and-metrics-list/
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
                  expression: 'ga:users',
                },
                {
                  expression: 'ga:newUsers',
                },
                {
                  expression: 'ga:bounceRate',
                },
              ],
            },
          ],
        },
      });

      // this.logger.debug(response);

      // get all values form the insane response
      const usersCount = response.data.reports![0].data?.rows![0].metrics![0].values![0];
      const newUsersCount = response.data.reports![0].data?.rows![0].metrics![0].values![1];
      const bounceRate = response.data.reports![0].data?.rows![0].metrics![0].values![2];

      await this.googleAnalyticsRepository.insert({
        viewId: id,
        usersCount: parseInt(usersCount),
        newUsersCount: parseInt(newUsersCount),
        bounceRate: parseFloat(bounceRate),
      });
    }

    this.logger.debug(`googleAnalyticsRecords count: ${await this.googleAnalyticsRepository.count()}`);
  }
}
