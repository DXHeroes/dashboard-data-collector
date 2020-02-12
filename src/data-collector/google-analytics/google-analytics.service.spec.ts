import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAnalyticsService } from './google-analytics.service';

describe('GoogleAnalyticsService', () => {
  let service: GoogleAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleAnalyticsService],
    }).compile();

    service = module.get<GoogleAnalyticsService>(GoogleAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
