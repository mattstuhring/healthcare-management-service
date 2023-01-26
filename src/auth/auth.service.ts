import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { UserEntity } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';

@Injectable()
export class AuthService {
  private userRepository: Repository<UserEntity>;
  private jwtService: JwtService;

  constructor(
    @InjectRepository(UserEntity)
    userRepository: Repository<UserEntity>,
    jwtService: JwtService,
  ) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  // Access - Admin, Employee
  async signIn(
    authLoginUserDto: AuthLoginUserDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authLoginUserDto;

    const user = await this.userRepository.findOneBy({ username });
    const match = await bcrypt.compare(password, user.password);

    if (user && match) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
