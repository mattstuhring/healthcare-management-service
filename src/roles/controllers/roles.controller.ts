import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleName } from '../constants/role.enum';
import { Roles } from '../decorators/roles.decorator';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { GetRoleDto } from '../dtos/get-role.dto';
import { GetRoleByNameDto } from '../dtos/get-role-by-name.dto';
import { RoleEntity } from '../entity/role.entity';
import { RolesGuard } from '../guards/roles.guard';
import { RolesService } from '../services/roles.service';
import { AuthJwtGuard } from '../../auth/guards/auth-jwt.guard';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateRoleDto } from '../dtos/update-role.dto';
import { DeleteRoleDto } from '../dtos/delete-role.dto';
import { CommonApiErrorResponses } from '../../global/decorators/common-api-error-responses.decorator';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(AuthJwtGuard)
@UseGuards(RolesGuard)
export class RolesController {
  private rolesService: RolesService;

  constructor(rolesService: RolesService) {
    this.rolesService = rolesService;
  }

  @Post()
  @ApiCreatedResponse({ description: 'The resource was created Succesfully' })
  @ApiConflictResponse({ description: 'The resource aleady exists' })
  @CommonApiErrorResponses()
  @Roles(RoleName.SUPER_ADMIN)
  @HttpCode(201)
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The resource was fetched successfully' })
  @CommonApiErrorResponses()
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getRole(@Param() getRoleDto: GetRoleDto): Promise<RoleEntity> {
    return this.rolesService.getRole(getRoleDto);
  }

  @Get('name/:name')
  @ApiOkResponse({ description: 'The resource was fetched successfully' })
  @CommonApiErrorResponses()
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getRoleByName(
    @Param() getRoleByNameDto: GetRoleByNameDto,
  ): Promise<RoleEntity> {
    return this.rolesService.getRoleByName(getRoleByNameDto);
  }

  @Get()
  @ApiOkResponse({ description: 'The resource was fetched successfully' })
  @CommonApiErrorResponses()
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getRoles(): Promise<RoleEntity[]> {
    return this.rolesService.getRoles();
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'The resource was fetched successfully' })
  @CommonApiErrorResponses()
  @Roles(RoleName.SUPER_ADMIN)
  updateRole(
    @Param() getRoleDto: GetRoleDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity> {
    return this.rolesService.updateRole(getRoleDto, updateRoleDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'The resource was deleted successfully',
  })
  @CommonApiErrorResponses()
  @Roles(RoleName.SUPER_ADMIN)
  @HttpCode(204)
  deleteRole(@Param() deleteRoleDto: DeleteRoleDto): Promise<void> {
    return this.rolesService.deleteRole(deleteRoleDto);
  }
}
