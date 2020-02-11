import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'githubRecords' })
export class GithubRecord extends BaseEntity {
  @Column({ length: 300 })
  owner!: string;

  @Column({ length: 300 })
  name!: string;

  @Column('int')
  starsCount!: number;

  @Column('int')
  watchersCount!: number;

  @Column('int')
  forksCount!: number;

  @Column('int')
  openIssues!: number;
}
