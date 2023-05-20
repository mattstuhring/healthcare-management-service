import { updateUserDtoStub } from '../mocks/users.stub';
import { validate } from 'class-validator';
import { UpdateUserDto } from '../../../../src/common/users/dtos/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { RoleName } from '../../../../src/common/roles/constants/role.enum';

describe('UpdateUserDto', () => {
  let dto: UpdateUserDto;

  beforeEach(() => {
    dto = {
      username: updateUserDtoStub.username,
      name: updateUserDtoStub.name,
      dateOfBirth: updateUserDtoStub.dateOfBirth,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(UpdateUserDto, dto);

    // Act
    const errors = await validate(dtoObject);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should pass when optional fields are not present', async () => {
    // Arrange
    const dtoObject = plainToInstance(UpdateUserDto, {});

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
      const dtoObject = plainToInstance(UpdateUserDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('username should not be empty');
    });

    it('should fail when username is an invalid email', async () => {
      // Arrange
      dto.username = 'test';
      const dtoObject = plainToInstance(UpdateUserDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('username must be an email');
    });
  });

  /**
   * name
   */
  describe('name', () => {
    it('should fail when name is empty', async () => {
      // Arrange
      dto.name = '';
      const dtoObject = plainToInstance(UpdateUserDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('name should not be empty');
    });
  });

  /**
   * dateOfBirth
   */
  describe('dateOfBirth', () => {
    it('should fail when dateOfBirth is empty', async () => {
      // Arrange
      dto.dateOfBirth = '';
      const dtoObject = plainToInstance(UpdateUserDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'dateOfBirth should not be empty',
      );
    });
  });

  /**
   * roleName
   */
  describe('roleName', () => {
    it('should pass when roleName is empty', async () => {
      // Arrange
      const dtoObject = plainToInstance(UpdateUserDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(errors.length).toBe(0);
    });

    it('should pass when roleName is an enum', async () => {
      // Arrange
      dto.roleName = RoleName.ADMIN;
      const dtoObject = plainToInstance(UpdateUserDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(errors.length).toBe(0);
    });

    it('should fail when roleName is not an enum', async () => {
      // Arrange
      const testDto: any = {
        roleName: 'test',
      };
      const dtoObject = plainToInstance(UpdateUserDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'roleName must be a valid enum value',
      );
    });
  });
});
