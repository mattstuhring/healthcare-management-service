import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/auth/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../../src/users/services/users.service';
import { ConfigService } from '@nestjs/config';
import { createUserDtoStub, userCustomerStub } from '../users/mocks/users.stub';
import { RoleName } from '../../../src/roles/constants/role.enum';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  authJwtResponseStub,
  authLoginUserDtoStub,
  authRefreshTokenDtoStub,
  authRefreshTokenPayloadStub,
} from './mocks/auth.stub';
import {
  configServiceMock,
  jwtServiceMock,
  usersServiceMock,
} from './mocks/auth.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useFactory: usersServiceMock,
        },
        {
          provide: JwtService,
          useFactory: jwtServiceMock,
        },
        {
          provide: ConfigService,
          useFactory: configServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  /**
   * Sign Up Customer
   */
  describe('signUpCustomer()', () => {
    it('should return user', async () => {
      // Arrange
      const spy = jest.spyOn(authService, 'signUpCustomer');

      // Act
      const response = await authService.signUpCustomer(createUserDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(createUserDtoStub);
      expect(response).toEqual(userCustomerStub);
    });

    it('should throw BadRequestException', async () => {
      // Arrange
      createUserDtoStub.roleName = RoleName.ADMIN;

      // Act & Assert
      await expect(
        authService.signUpCustomer(createUserDtoStub),
      ).rejects.toThrowError(BadRequestException);
    });

    it('should create user with Customer role', async () => {
      // Arrange
      const spy = jest.spyOn(usersService, 'createUser');
      createUserDtoStub.roleName = undefined;

      // Act
      const response = await authService.signUpCustomer(createUserDtoStub);

      // Assert
      expect(spy).toBeCalledTimes(1);
      expect(response).toEqual(userCustomerStub);
    });
  });

  /**
   * Login
   */
  describe('login()', () => {
    it('should return JWT', async () => {
      // Arrange
      const spy = jest.spyOn(authService, 'login');

      const createJwtSpy = jest
        .spyOn(AuthService.prototype as any, 'createJwt')
        .mockReturnValue(authJwtResponseStub);

      jest
        .spyOn(AuthService.prototype as any, 'validatePassword')
        .mockReturnValue(true);

      // Act
      const response = await authService.login(authLoginUserDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(authLoginUserDtoStub);
      expect(createJwtSpy).toBeCalledTimes(1);
      expect(response).toEqual(authJwtResponseStub);
    });

    it('should create JWT', async () => {
      // Arrange
      const createJwtSpy = jest
        .spyOn(AuthService.prototype as any, 'createJwt')
        .mockReturnValue(authJwtResponseStub);

      jest
        .spyOn(AuthService.prototype as any, 'validatePassword')
        .mockReturnValue(true);

      // Act
      await authService.login(authLoginUserDtoStub);

      // Assert
      expect(createJwtSpy).toBeCalledTimes(1);
      expect(createJwtSpy).toReturnWith(authJwtResponseStub);
    });

    it('should get user by name', async () => {
      // Arrange
      const spy = jest.spyOn(usersService, 'getUserByUsername');

      // Act
      await authService.login(authLoginUserDtoStub);

      // Assert
      expect(spy).toBeCalledTimes(1);
    });

    it('should catch NotFoundException and throw UnauthorizedException', async () => {
      // Arrange
      jest
        .spyOn(usersService, 'getUserByUsername')
        .mockRejectedValue(new NotFoundException());

      // Act & Assert
      await expect(
        authService.login(authLoginUserDtoStub),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should catch BadRequestException and throw UnauthorizedException', async () => {
      // Arrange
      const spy = jest
        .spyOn(AuthService.prototype as any, 'validatePassword')
        .mockRejectedValue(new BadRequestException());

      // Act & Assert
      await expect(
        authService.login(authLoginUserDtoStub),
      ).rejects.toThrowError(UnauthorizedException);
      expect(spy).toBeCalledTimes(1);
    });
  });

  /**
   * Logout
   */
  describe('logout()', () => {
    it('should return message', async () => {
      // Arrange
      const spy = jest.spyOn(authService, 'logout');

      // Act
      const response = await authService.logout();

      // Assert
      expect(spy).toHaveBeenCalledWith();
      expect(response.message).toEqual('Successful logout');
    });
  });

  /**
   * Refresh Token
   */
  describe('refreshToken()', () => {
    it('should return Jwt', async () => {
      // Arrange
      const spy = jest.spyOn(authService, 'refreshToken');

      const createJwtSpy = jest
        .spyOn(AuthService.prototype as any, 'createJwt')
        .mockReturnValue(authJwtResponseStub);

      // Act
      const response = await authService.refreshToken(authRefreshTokenDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(authRefreshTokenDtoStub);
      expect(createJwtSpy).toBeCalledTimes(1);
      expect(response).toEqual(authJwtResponseStub);
    });

    it('should verify and decode JWT', async () => {
      // Arrange
      const verifySpy = jest.spyOn(jwtService, 'verify');
      const decodeSpy = jest.spyOn(jwtService, 'decode');

      // Act
      await authService.refreshToken(authRefreshTokenDtoStub);

      // Assert
      expect(verifySpy).toBeCalledTimes(1);
      expect(decodeSpy).toBeCalledTimes(1);
      expect(decodeSpy).toReturnWith(authRefreshTokenPayloadStub);
    });

    it('should create JWT', async () => {
      // Arrange
      const createJwtSpy = jest
        .spyOn(AuthService.prototype as any, 'createJwt')
        .mockReturnValue(authJwtResponseStub);

      // Act
      await authService.refreshToken(authRefreshTokenDtoStub);

      // Assert
      expect(createJwtSpy).toBeCalledTimes(1);
      expect(createJwtSpy).toReturnWith(authJwtResponseStub);
    });

    it('should throw UnauthorizedException', async () => {
      // Arrange
      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error();
      });

      // Act & Assert
      await expect(
        authService.refreshToken(authRefreshTokenDtoStub),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
