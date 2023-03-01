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
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserByUsernameDto } from './dtos/get-user-by-username.dto';
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
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';

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
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getUser(@Param() getUserDto: GetUserDto): Promise<UserEntity> {
    return this.usersService.getUser(getUserDto);
  }

  @Get('username/:username')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getUserByUsername(
    @Param('username') getUserByUsernameDto: GetUserByUsernameDto,
  ): Promise<UserEntity> {
    return this.usersService.getUserByUsername(getUserByUsernameDto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'The resource was updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Roles(RoleName.ADMIN)
  updateUser(
    @Param() getUserDto: GetUserDto,
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
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Roles(RoleName.ADMIN)
  @HttpCode(204)
  deleteUser(@Param() deleteUserDto: DeleteUserDto): Promise<void> {
    return this.usersService.deleteUser(deleteUserDto);
  }
}
