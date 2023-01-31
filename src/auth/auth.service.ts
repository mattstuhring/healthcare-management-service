import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { UserEntity } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';
import { GetUserByNameDto } from 'src/users/dto/get-user-by-name.dto';

@Injectable()
export class AuthService {
  private usersService: UsersService;
  private jwtService: JwtService;

  constructor(usersService: UsersService, jwtService: JwtService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  // Access - Admin, Employee
  async signIn(
    authLoginUserDto: AuthLoginUserDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authLoginUserDto;

    const getUserByNameDto: GetUserByNameDto = new GetUserByNameDto();
    getUserByNameDto.username = username;

    const user = await this.usersService.getUserByName(getUserByNameDto);

    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
