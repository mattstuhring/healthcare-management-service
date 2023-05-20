import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { GetRoleByNameDto } from '../../../../src/common/roles/dtos/get-role-by-name.dto';
import { getRoleByNameDtoStub } from '../mocks/roles.stub';
import { RoleName } from '../../../../src/common/roles/constants/role.enum';

describe('GetUserByUsernameDto', () => {
  let dto: GetRoleByNameDto;

  beforeEach(() => {
    dto = {
      name: getRoleByNameDtoStub.name,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(GetRoleByNameDto, dto);

    // Act
    const errors = await validate(dtoObject);

    // Assert
    expect(errors.length).toBe(0);
  });

  /**
   * name
   */
  describe('name', () => {
    it('should fail when name is empty', async () => {
      // Arrange
      const testDto: any = {
        name: '',
      };
      const dtoObject = plainToInstance(GetRoleByNameDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('name should not be empty');
    });

    it('should pass when name is an enum', async () => {
      // Arrange
      dto.name = RoleName.ADMIN;
      const dtoObject = plainToInstance(GetRoleByNameDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(errors.length).toBe(0);
    });

    it('should fail when roleName is not an enum', async () => {
      // Arrange
      const testDto: any = {
        name: 'test',
      };
      const dtoObject = plainToInstance(GetRoleByNameDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'name must be a valid enum value',
      );
    });
  });
});
