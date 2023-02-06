import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RoleName } from './constants/role-name.enum';
import { Roles } from './decorators/roles.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { GetRoleByNameDto } from './dto/get-role-by-name.dto';
import { RoleEntity } from './role.entity';
import { RolesGuard } from './roles.guard';
import { RolesService } from './roles.service';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateRoleDto } from './dto/update-role.dto';
import { DeleteRoleDto } from './dto/delete-role.dto';

@ApiTags('Roles')
@Controller('roles')
@UseGuards(AuthJwtGuard)
@UseGuards(RolesGuard)
export class RolesController {
  private rolesService: RolesService;
  private logger = new Logger('RolesController');

  constructor(rolesService: RolesService) {
    this.rolesService = rolesService;
  }

  @Post()
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiConflictResponse({ description: 'Duplicate entity' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(RoleName.ADMIN)
  @HttpCode(201)
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @Roles(RoleName.ADMIN)
  getRole(@Param('id') getRoleDto: GetRoleDto): Promise<RoleEntity> {
    return this.rolesService.getRole(getRoleDto);
  }

  @Get('name/:name')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @Roles(RoleName.ADMIN)
  getRoleByName(
    @Param('name') getRoleByNameDto: GetRoleByNameDto,
  ): Promise<RoleEntity> {
    return this.rolesService.getRoleByName(getRoleByNameDto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'The resource was updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(RoleName.ADMIN)
  updateRole(
    @Param('id') getRoleDto: GetRoleDto,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity> {
    return this.rolesService.updateRole(getRoleDto, updateRoleDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'The resource was returned successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @Roles(RoleName.ADMIN)
  @HttpCode(204)
  deleteRole(@Param('id') deleteRoleDto: DeleteRoleDto): Promise<void> {
    return this.rolesService.deleteRole(deleteRoleDto);
  }
}
