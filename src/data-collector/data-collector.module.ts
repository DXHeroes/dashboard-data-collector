import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubRecord } from '../model/githubRecord.entity';
import { GithubService } from './github/github.service';

@Module({
  imports: [TypeOrmModule.forFeature([GithubRecord])],
  providers: [GithubService],
})
export class DataCollectorModule {}
