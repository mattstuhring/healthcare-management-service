import { getUserDtoStub } from '../mocks/users.stub';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GetUserDto } from '../../dtos/get-user.dto';

describe('GetUserByUsernameDto', () => {
  let dto: GetUserDto;

  beforeEach(() => {
    dto = {
      id: getUserDtoStub.id,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(GetUserDto, dto);

    // Act
    const errors = await validate(dtoObject);

    // Assert
    expect(errors.length).toBe(0);
  });

  /**
   * id
   */
  describe('id', () => {
    it('should fail when id is empty', async () => {
      // Arrange
      dto.id = '';
      const dtoObject = plainToInstance(GetUserDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id should not be empty');
    });

    it('should fail when id is not a string', async () => {
      // Arrange
      const dtoObject = plainToInstance(GetUserDto, {});

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id must be a string');
    });
  });
});
