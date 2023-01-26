import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleEntity } from './role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  private rolesService: RolesService;
  private logger = new Logger('RolesController');

  constructor(rolesService: RolesService) {
    this.rolesService = rolesService;
  }

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.createRole(createRoleDto);
  }
}
