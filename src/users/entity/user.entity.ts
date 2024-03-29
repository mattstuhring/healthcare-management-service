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
import { RecordEntity } from '../../records/entity/record.entity';
import { RoleEntity } from '../../roles/entity/role.entity';

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

  @ManyToOne(() => RoleEntity, (role: RoleEntity) => role.users, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
