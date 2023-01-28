import { UserEntity } from '../users/user.entity';
import { Role } from './constants/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: Role;

  @Column()
  create: boolean;

  @Column()
  read: boolean;

  @Column()
  update: boolean;

  @Column()
  delete: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserEntity, (user) => user.role, { eager: true })
  @Exclude()
  users: UserEntity[];
}
