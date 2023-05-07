import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AuthLoginUserDto } from '../../../../src/auth/dtos/auth-login-user.dto';
import { authLoginUserDtoStub } from '../mocks/auth.stub';

describe('AuthLoginUserDto', () => {
  let dto: AuthLoginUserDto;

  beforeEach(() => {
    dto = {
      username: authLoginUserDtoStub.username,
      password: authLoginUserDtoStub.password,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(AuthLoginUserDto, dto);
    // Act
    const errors = await validate(dtoObject);

    // Assert
    expect(errors.length).toBe(0);
  });

  /**
   * username
   */
  describe('username', () => {
    it('should fail when username is empty', async () => {
      // Arrange
      dto.username = '';
      const dtoObject = plainToInstance(AuthLoginUserDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('username should not be empty');
    });

    it('should fail when username is an invalid email', async () => {
      // Arrange
      dto.username = 'test';
      const dtoObject = plainToInstance(AuthLoginUserDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('username must be an email');
    });
  });

  /**
   * password
   */
  describe('password', () => {
    it('should fail when password is empty', async () => {
      // Arrange
      dto.password = '';
      const dtoObject = plainToInstance(AuthLoginUserDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('password should not be empty');
    });
  });
});
