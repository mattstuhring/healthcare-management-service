import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleByIdDto } from './dto/get-role-by-id.dto';
import { GetRoleByNameDto } from './dto/get-role-by-name.dto';
import { RoleEntity } from './role.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  private rolesService: RolesService;
  private logger = new Logger('RolesController');

  constructor(rolesService: RolesService) {
    this.rolesService = rolesService;
  }

  @Get(':id')
  getRoleById(@Param() getRoleByIdDto: GetRoleByIdDto): Promise<RoleEntity> {
    return this.rolesService.getRoleById(getRoleByIdDto);
  }

  @Get('/search/:name')
  getRoleByName(
    @Param() getRoleByNameDto: GetRoleByNameDto,
  ): Promise<RoleEntity> {
    return this.rolesService.getRoleByName(getRoleByNameDto);
  }

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.createRole(createRoleDto);
  }
}
