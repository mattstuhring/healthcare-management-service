import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { deleteRoleDtoStub } from '../mocks/roles.stub';
import { DeleteRoleDto } from '../../../../src/roles/dtos/delete-role.dto';

describe('DeleteRoleDto', () => {
  let dto: DeleteRoleDto;

  beforeEach(() => {
    dto = {
      id: deleteRoleDtoStub.id,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(DeleteRoleDto, dto);

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
      const dtoObject = plainToInstance(DeleteRoleDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id should not be empty');
    });

    it('should fail when id is not a string', async () => {
      // Arrange
      const dtoObject = plainToInstance(DeleteRoleDto, {});

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id must be a string');
    });
  });
});
