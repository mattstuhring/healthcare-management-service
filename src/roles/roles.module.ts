import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from './role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  exports: [RolesService],
})
export class RolesModule {}
