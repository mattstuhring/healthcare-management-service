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
import { CreateRoleDto } from './dtos/create-role.dto';
import { GetRoleDto } from './dtos/get-role.dto';
import { GetRoleByNameDto } from './dtos/get-role-by-name.dto';
import { RoleEntity } from './role.entity';
import { RolesGuard } from './roles.guard';
import { RolesService } from './roles.service';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateRoleDto } from './dtos/update-role.dto';
import { DeleteRoleDto } from './dtos/delete-role.dto';

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
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
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
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Roles(RoleName.ADMIN)
  getRole(@Param() getRoleDto: GetRoleDto): Promise<RoleEntity> {
    return this.rolesService.getRole(getRoleDto);
  }

  @Get('name/:name')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
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
    @Param() getRoleDto: GetRoleDto,
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
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Roles(RoleName.ADMIN)
  @HttpCode(204)
  deleteRole(@Param() deleteRoleDto: DeleteRoleDto): Promise<void> {
    return this.rolesService.deleteRole(deleteRoleDto);
  }
}
