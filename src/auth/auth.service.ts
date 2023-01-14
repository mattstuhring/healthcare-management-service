import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

@Injectable()
export class AuthService {
  private userRepository: Repository<User>;
  private jwtService: JwtService;
  private configService: ConfigService;
  private userPool: CognitoUserPool;

  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
    jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
    this.configService = configService;

    this.userPool = new CognitoUserPool({
      UserPoolId: this.configService.get('COGNITO_USER_POOL_ID'),
      ClientId: this.configService.get('COGNITO_CLIENT_ID'),
    });
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
