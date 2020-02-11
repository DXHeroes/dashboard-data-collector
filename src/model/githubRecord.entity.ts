import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'githubRecords' })
export class Item extends BaseEntity {

  @Column({ length: 300 })
  repoOwner!: string;

  @Column({ length: 300 })
  repoName!: string;

  @Column('int')
  starCount!: number;
}
