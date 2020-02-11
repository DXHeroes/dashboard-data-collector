import { PrimaryGeneratedColumn, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createAt!: Date;
}
