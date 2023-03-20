import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthAccessTokenPayload } from './models/auth-access-token-payload.interface';
import { UsersService } from '../users/users.service';
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
    if (
      createUserDto.roleName &&
      createUserDto.roleName !== RoleName.CUSTOMER
    ) {
      throw new BadRequestException();
    }

    createUserDto.roleName = RoleName.CUSTOMER;

    return await this.usersService.createUser(createUserDto);
  }

  /**
   * User Login
   * @param authLoginUserDto
   * @returns AccessToken and RefreshToken
   */
  async login(authLoginUserDto: AuthLoginUserDto): Promise<AuthJwtResponse> {
    const { username, password } = authLoginUserDto;

    try {
      // Verify user exists
      const user: UserEntity = await this.usersService.getUserByUsername({
        username,
      });
      if (!user) {
        throw new NotFoundException();
      }

      // Validate password
      await this.validatePassword(password, user.password);

      // Create JWT AccessToken & RefreshToken
      return this.createJwt(user);
    } catch (err) {
      if (
        err instanceof NotFoundException ||
        err instanceof BadRequestException
      ) {
        throw new UnauthorizedException(
          'Username or password may be incorrect. Please try again',
        );
      } else {
        throw new InternalServerErrorException(err.name, err.message);
      }
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
      const user: UserEntity = await this.usersService.getUserByUsername({
        username: decodedToken.username,
      });

      // Create new JWT token w/ AccessToken & RefreshToken
      return this.createJwt(user);
    } catch (err) {
      throw new UnauthorizedException('Expired token. Please login again.');
    }
  }

  /**
   * Helper to create JWT AccessToken & RefreshToken
   * @param user
   * @returns AcessToken and RefreshToken
   */
  private createJwt(user: UserEntity): AuthJwtResponse {
    const { username, role } = user;

    // Create AccessToken expiresIn 30 minutes
    const accessToken: string = this.jwtService.sign({
      username,
      role,
    });

    // Create RefreshToken expiresIn 24 hours
    const refreshPayload: AuthRefreshTokenPayload = {
      username,
    };
    const refreshToken: string = this.jwtService.sign(refreshPayload, {
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  /**
   * Validate password
   * @param password
   * @param userPassword
   * @returns boolean
   */
  private async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const match = await bcrypt.compare(password, userPassword);

    if (!match) {
      throw new BadRequestException();
    }

    return match;
  }
}
