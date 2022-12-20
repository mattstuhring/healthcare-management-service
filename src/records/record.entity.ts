import { User } from '../users/user.entity';
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

@Entity()
export class Record {
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

  @Column({ name: 'updated_by' })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.records, { eager: false })
  @Exclude()
  user: User;
}
