import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'googleAnalyticsRecords' })
export class GoogleAnalyticsRecord extends BaseEntity {
  @Column({ length: 300 })
  viewId!: string;

  @Column('int')
  usersCount!: number;

  @Column('int')
  newUsersCount!: number;

  @Column('float')
  bounceRate!: number;
}
