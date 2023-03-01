import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthAccessTokenPayload } from './models/auth-access-token-payload.interface';
import { UsersService } from '../users/users.service';
import { GetUserByUsernameDto } from '../users/dtos/get-user-by-username.dto';
import { UserEntity } from '../users/user.entity';
import { AuthJwtResponse } from './models/auth-jwt-response.interface';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { RoleName } from '../roles/constants/role-name.enum';
import { AuthRefreshTokenPayload } from './models/auth-refresh-token-payload.interface';
import { AuthRefreshTokenDto } from './dtos/auth-refresh-token.dto';
import { ConfigService } from '@nestjs/config';

/**
 * Auth Service - User authentication & customer creation
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

  /**
   * Customer Sign Up
   * @param createUserDto
   * @returns the user
   */
  async signUpCustomer(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, password } = createUserDto;

    const user = new CreateUserDto();
    user.password = password;
    user.username = username;
    user.roleName = RoleName.CUSTOMER;

    return await this.usersService.createUser(user);
  }

  /**
   * User Login
   * @param authLoginUserDto
   * @returns AccessToken and RefreshToken
   */
  async login(authLoginUserDto: AuthLoginUserDto): Promise<AuthJwtResponse> {
    const { username, password } = authLoginUserDto;

    const getUserByUsernameDto: GetUserByUsernameDto = {
      username,
    };

    try {
      // Verify user exists
      const user: UserEntity = await this.usersService.getUserByUsername(
        getUserByUsernameDto,
      );
      if (!user) {
        throw new Error();
      }

      // Validate password
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new Error();
      }

      // Create JWT AccessToken & RefreshToken
      const authJwtResponse: AuthJwtResponse = this.createJwt(user);

      return authJwtResponse;
    } catch (err) {
      throw new UnauthorizedException(
        'Username or password may be incorrect. Please try again',
      );
    }
  }

  /**
   * User Logout
   * @returns message
   */
  async logout(): Promise<{ message: string }> {
    /*
      Tokens for this project are short-lived
        - AccessToken exp 30 minutes
        - RefreshToken exp 24 hours
      Client needs to invalidate the user session
      Future implementations could support RefreshToken management for more robust secruity
    */
    return { message: 'Successful logout' };
  }

  /**
   * User Refresh Token
   * @param authRefreshTokenDto
   * @returns AcessToken and RefreshToken
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
      const getUserByUsernameDto: GetUserByUsernameDto = {
        username: decodedToken.username,
      };
      const user: UserEntity = await this.usersService.getUserByUsername(
        getUserByUsernameDto,
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

  /**
   * Helper function to create JWT AccessToken & RefreshToken
   * @param user
   * @returns AcessToken and RefreshToken
   */
  private createJwt(user: UserEntity): AuthJwtResponse {
    const { username, role } = user;

    // Create AccessToken expiresIn 30 minutes
    const accessPayload: AuthAccessTokenPayload = {
      username,
      role,
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
