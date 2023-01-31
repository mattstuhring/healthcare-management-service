import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserByNameDto } from './dto/get-user-by-name.dto';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  @Get(':username')
  getUserByName(
    @Param() getUserByNameDto: GetUserByNameDto,
  ): Promise<UserEntity> {
    return this.usersService.getUserByName(getUserByNameDto);
  }

  @Post()
  @HttpCode(201)
  createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.usersService.createUser(createUserDto);
  }
}
