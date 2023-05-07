import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { AppointmentEntity } from '../appiontments/appointment.entity';
import { RecordEntity } from '../records/record.entity';
import { RoleEntity } from '../roles/role.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  name: string;

  @Column({ name: 'date_of_birth' })
  dateOfBirth: string;

  @CreateDateColumn({ name: 'created_at' })
  createDate: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updateDate: Date;

  @OneToMany(() => RecordEntity, (record) => record.user, { eager: false })
  @Exclude()
  records: RecordEntity[];

  @OneToMany(() => AppointmentEntity, (appt) => appt.user, { eager: false })
  @Exclude()
  appointments: AppointmentEntity[];

  @ManyToOne(() => RoleEntity, (role: RoleEntity) => role.users, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
