import { UserEntity } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HealthStatus } from './constants/record-health-status.enum';
import { Healthcare } from './constants/record-healthcare.enum';

@Entity({ name: 'record' })
export class RecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'type_of_care' })
  typeOfCare: Healthcare;

  @Column({ name: 'health_status' })
  healthStatus: HealthStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.records, { eager: true })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;
}
