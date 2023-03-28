import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { authRefreshTokenDtoStub } from '../mocks/auth.stub';
import { AuthRefreshTokenDto } from '../../dtos/auth-refresh-token.dto';

describe('AuthRefreshTokenDto', () => {
  let dto: AuthRefreshTokenDto;

  beforeEach(() => {
    dto = {
      refreshToken: authRefreshTokenDtoStub.refreshToken,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(AuthRefreshTokenDto, dto);

    // Act
    const errors = await validate(dtoObject);

    // Assert
    expect(errors.length).toBe(0);
  });

  /**
   * id
   */
  describe('refreshToken', () => {
    it('should fail when refreshToken is empty', async () => {
      // Arrange
      dto.refreshToken = '';
      const dtoObject = plainToInstance(AuthRefreshTokenDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'refreshToken should not be empty',
      );
    });

    it('should fail when refreshToken is not a string', async () => {
      // Arrange
      const dtoObject = plainToInstance(AuthRefreshTokenDto, {});

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('refreshToken must be a string');
    });
  });
});
