import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthAccessTokenPayload } from './constants/auth-access-token-payload.interface';
import { UsersService } from '../users/users.service';
import { GetUserByNameDto } from '../users/dto/get-user-by-name.dto';
import { UserEntity } from '../users/user.entity';
import { AuthJwtResponse } from './constants/auth-jwt-response.interface';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RoleName } from '../roles/constants/role-name.enum';
import { AuthRefreshTokenPayload } from './constants/auth-refresh-token-payload.interface';
import { AuthRefreshTokenDto } from './dto/auth-refresh-token.dto';
import { ConfigService } from '@nestjs/config';

/*
  Auth Service - User authentication & customer creation
*/
@Injectable()
export class AuthService {
  private usersService: UsersService;
  private jwtService: JwtService;
  private configService: ConfigService;

  constructor(
    usersService: UsersService,
    jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.usersService = usersService;
    this.jwtService = jwtService;
    this.configService = configService;
  }

  /*
    User Sign Up
  */
  async signup(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, password, role } = createUserDto;

    const user = new CreateUserDto();
    user.password = password;
    user.username = username;
    user.role = role ? role : RoleName.CUSTOMER;

    return await this.usersService.createUser(user);
  }

  /*
    User Login
  */
  async login(authLoginUserDto: AuthLoginUserDto): Promise<AuthJwtResponse> {
    const { username, password } = authLoginUserDto;

    const getUserByNameDto: GetUserByNameDto = new GetUserByNameDto();
    getUserByNameDto.username = username;

    try {
      // Verify user exists
      const user: UserEntity = await this.usersService.getUserByName(
        getUserByNameDto,
      );
      if (!user) {
        throw new Error();
      }

      // Validate password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error();
      }

      // Create JWT token w/ AccessToken & RefreshToken
      const authJwtResponse: AuthJwtResponse = this.createJwt(user);

      return authJwtResponse;
    } catch (err) {
      throw new UnauthorizedException(
        'Username or password may be incorrect. Please try again',
      );
    }
  }

  /*
    User Refresh Token
  */
  async refreshToken(
    authRefreshTokenDto: AuthRefreshTokenDto,
  ): Promise<AuthJwtResponse> {
    try {
      // Validate token
      const token = this.jwtService.verify(authRefreshTokenDto.refreshToken);

      // Decode token
      const decodedToken = this.jwtService.decode(
        token,
      ) as AuthRefreshTokenPayload;

      // Retrieve user entity
      const getUserByNameDto: GetUserByNameDto = new GetUserByNameDto();
      getUserByNameDto.username = decodedToken.username;
      const user: UserEntity = await this.usersService.getUserByName(
        getUserByNameDto,
      );

      // Create JWT token w/ AccessToken & RefreshToken
      const authJwtResponse: AuthJwtResponse = this.createJwt(user);

      return authJwtResponse;
    } catch (err) {
      throw new UnauthorizedException(
        'Username or password may be incorrect. Please try again',
      );
    }
  }

  /*
    Helper function to create JWT w/ AccessToken & RefreshToken
  */
  private createJwt(user: UserEntity): AuthJwtResponse {
    const { username, role } = user;

    // Create AccessToken expiresIn 30 minutes
    const accessPayload: AuthAccessTokenPayload = {
      username,
      role: role.name,
    };
    const accessToken: string = this.jwtService.sign(accessPayload);

    // Create RefreshToken expiresIn 24 hours
    const refreshPayload: AuthRefreshTokenPayload = {
      username,
    };
    const refreshToken: string = this.jwtService.sign(refreshPayload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }
}
