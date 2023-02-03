import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleName } from './constants/role-name.enum';
import { Roles } from './decorators/roles.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { GetRolesDto } from './dto/get-roles.dto';
import { RoleEntity } from './role.entity';
import { RolesGuard } from './roles.guard';
import { RolesService } from './roles.service';

@UseGuards(RolesGuard)
@Roles(RoleName.ADMIN)
@Controller('roles')
export class RolesController {
  private rolesService: RolesService;
  private logger = new Logger('RolesController');

  constructor(rolesService: RolesService) {
    this.rolesService = rolesService;
  }

  @Get(':id')
  getRole(@Param() getRoleDto: GetRoleDto): Promise<RoleEntity> {
    return this.rolesService.getRole(getRoleDto);
  }

  @Get()
  getRoleByName(@Query() getRolesDto: GetRolesDto): Promise<RoleEntity[]> {
    return this.rolesService.getRoles(getRolesDto);
  }

  @Post()
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.createRole(createRoleDto);
  }
}
