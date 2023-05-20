import { getRoleDtoStub } from '../mocks/roles.stub';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GetRoleDto } from '../../../../src/common/roles/dtos/get-role.dto';

describe('GetUserByUsernameDto', () => {
  let dto: GetRoleDto;

  beforeEach(() => {
    dto = {
      id: getRoleDtoStub.id,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(GetRoleDto, dto);

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
      const dtoObject = plainToInstance(GetRoleDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id should not be empty');
    });

    it('should fail when id is not a string', async () => {
      // Arrange
      const dtoObject = plainToInstance(GetRoleDto, {});

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('id must be a string');
    });
  });
});
