import { UserEntity } from '../../users/entity/user.entity';
import { RoleName } from '../constants/role.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { PermissionEntity } from '../../permissions/entity/permission.entity';

@Entity({ name: 'role' })
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: RoleName;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => UserEntity, (user) => user.role, { eager: false })
  @Exclude()
  users: UserEntity[];

  @ManyToMany(() => PermissionEntity)
  @JoinTable({
    name: 'roles_permissions',
    joinColumn: {
      name: 'role',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_role_permission_role_id',
    },
    inverseJoinColumn: {
      name: 'role_permission',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'fk_role_permission_permission_id',
    },
  })
  permissions: PermissionEntity[];
}
