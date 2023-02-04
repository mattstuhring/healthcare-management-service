import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
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

@Controller('users')
@UseGuards(AuthJwtGuard)
@UseGuards(RolesGuard)
export class UsersController {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @Get(':username')
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getUserByName(
    @Param() getUserByNameDto: GetUserByNameDto,
  ): Promise<UserEntity> {
    return this.usersService.getUserByName(getUserByNameDto);
  }

  @Post()
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  @HttpCode(201)
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(createUserDto);
  }
}
