import { UserEntity } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HealthStatus } from './constants/record-health-status.enum';
import { Healthcare } from './constants/record-healthcare.enum';
import { Exclude } from 'class-transformer';

@Entity({ name: 'record' })
export class RecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: string;

  @Column({ name: 'type_of_care' })
  typeOfCare: Healthcare;

  @Column({ name: 'health_status' })
  healthStatus: HealthStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.records, { eager: false })
  @Exclude()
  user: UserEntity;
}
