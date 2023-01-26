import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  providers: [RolesService],
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  controllers: [RolesController],
})
export class RolesModule {}
