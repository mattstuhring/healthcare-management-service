import { deleteUserDtoStub } from '../mocks/users.stub';
import { validate } from 'class-validator';
import { DeleteUserDto } from '../../dtos/delete-user.dto';
import { plainToInstance } from 'class-transformer';

describe('DeleteUserDto', () => {
  let dto: DeleteUserDto;

  beforeEach(() => {
    dto = {
      id: deleteUserDtoStub.id,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(DeleteUserDto, dto);

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
      const dtoObject = plainToInstance(DeleteUserDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id should not be empty');
    });

    it('should fail when id is not a string', async () => {
      // Arrange
      const dtoObject = plainToInstance(DeleteUserDto, {});

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id must be a string');
    });
  });
});
