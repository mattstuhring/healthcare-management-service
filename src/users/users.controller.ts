import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
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
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { CommonApiErrorResponses } from '../global/decorators/common-api-error-responses.decorator';
import { GetUsersDto } from './dtos/get-users.dto';

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
  @ApiCreatedResponse({ description: 'The resource was created Succesfully' })
  @ApiConflictResponse({ description: 'The resource aleady exists' })
  @CommonApiErrorResponses()
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  @HttpCode(201)
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(createUserDto);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The resource was fetched successfully' })
  @CommonApiErrorResponses()
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getUser(@Param() getUserDto: GetUserDto): Promise<UserEntity> {
    return this.usersService.getUser(getUserDto);
  }

  @Get('username/:username')
  @ApiOkResponse({ description: 'The resource was fetched successfully' })
  @CommonApiErrorResponses()
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getUserByUsername(
    @Param() getUserByUsernameDto: GetUserByUsernameDto,
  ): Promise<UserEntity> {
    return this.usersService.getUserByUsername(getUserByUsernameDto);
  }

  @Get()
  @ApiOkResponse({ description: 'The resource was fetched successfully' })
  @CommonApiErrorResponses()
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getUsers(@Query() getUsersDto: GetUsersDto): Promise<UserEntity[]> {
    return this.usersService.getUsers(getUsersDto);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'The resource was updated successfully' })
  @CommonApiErrorResponses()
  @Roles(RoleName.ADMIN)
  updateUser(
    @Param() getUserDto: GetUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.updateUser(getUserDto, updateUserDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'The resource was deleted successfully',
  })
  @CommonApiErrorResponses()
  @Roles(RoleName.ADMIN)
  @HttpCode(204)
  deleteUser(@Param() deleteUserDto: DeleteUserDto): Promise<void> {
    return this.usersService.deleteUser(deleteUserDto);
  }
}
