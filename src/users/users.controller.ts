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
import { RolesGuard } from '../roles/roles.guard';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserByNameDto } from './dto/get-user-by-name.dto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { Roles } from '../roles/decorators/roles.decorator';
import { RoleName } from '../roles/constants/role-name.enum';
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
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthJwtGuard)
@UseGuards(RolesGuard)
export class UsersController {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @Post()
  @ApiCreatedResponse({ description: 'Created succesfully' })
  @ApiConflictResponse({ description: 'Duplicate entity' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  @HttpCode(201)
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getUser(@Param('id') getUserDto: GetUserDto): Promise<UserEntity> {
    return this.usersService.getUser(getUserDto);
  }

  @Get('username/:username')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getUserByName(
    @Param('username') getUserByNameDto: GetUserByNameDto,
  ): Promise<UserEntity> {
    return this.usersService.getUserByName(getUserByNameDto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'The resource was updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(RoleName.ADMIN)
  updateUser(
    @Param('id') getUserDto: GetUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.updateUser(getUserDto, updateUserDto);
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
  deleteUser(@Param('id') deleteUserDto: DeleteUserDto): Promise<void> {
    return this.usersService.deleteUser(deleteUserDto);
  }
}
