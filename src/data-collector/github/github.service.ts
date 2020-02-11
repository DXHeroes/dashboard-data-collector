import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Octokit } from '@octokit/rest';
import { GithubRecord } from '../../model/githubRecord.entity';
import { ConfigService } from '../../config/config.service';
import { ConfigKeys } from '../../config/config.interface';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(
    @InjectRepository(GithubRecord)
    private readonly githubRecordRepository: Repository<GithubRecord>,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async githubRecordCron() {
    this.logger.debug('#githubRecordCron');

    const octokit = new Octokit({ auth: this.configService.get(ConfigKeys.GITHUB_TOKEN) });

    const repos = this.configService
      .get(ConfigKeys.GITHUB_REPOS)
      .split(',')
      .map((r) => {
        return { owner: r.split('/')[0], repo: r.split('/')[1] };
      });

    for (const repo of repos) {
      const repoData = await octokit.repos.get({ owner: repo.owner, repo: repo.repo });
      // this.logger.debug(repoData.data);

      await this.githubRecordRepository.insert({
        owner: repoData.data.owner.login,
        name: repoData.data.name,
        starsCount: repoData.data.stargazers_count,
        watchersCount: repoData.data.watchers_count,
        forksCount: repoData.data.forks_count,
        openIssues: repoData.data.open_issues_count,
      });
    }

    this.logger.debug(`githubRecords count: ${await this.githubRecordRepository.count()}`);
  }
}
