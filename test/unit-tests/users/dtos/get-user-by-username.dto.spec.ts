import { getUserByUsernameDtoStub } from '../mocks/users.stub';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GetUserByUsernameDto } from '../../../../src/users/dtos/get-user-by-username.dto';

describe('GetUserByUsernameDto', () => {
  let dto: GetUserByUsernameDto;

  beforeEach(() => {
    dto = {
      username: getUserByUsernameDtoStub.username,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(GetUserByUsernameDto, dto);

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
      const dtoObject = plainToInstance(GetUserByUsernameDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('username should not be empty');
    });

    it('should fail when username is not an email', async () => {
      // Arrange
      const dtoObject = plainToInstance(GetUserByUsernameDto, {});

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('username must be an email');
    });
  });
});
