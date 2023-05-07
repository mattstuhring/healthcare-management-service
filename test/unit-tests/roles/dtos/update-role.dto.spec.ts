import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { UpdateRoleDto } from '../../../../src/roles/dtos/update-role.dto';
import { updateRoleDtoStub } from '../mocks/roles.stub';

describe('CreateRoleDto', () => {
  let dto: UpdateRoleDto;

  beforeEach(() => {
    dto = {
      name: updateRoleDtoStub.name,
      create: updateRoleDtoStub.create,
      read: updateRoleDtoStub.read,
      update: updateRoleDtoStub.update,
      delete: updateRoleDtoStub.delete,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(UpdateRoleDto, dto);

    // Act
    const errors = await validate(dtoObject);

    // Assert
    expect(errors.length).toBe(0);
  });

  it('should pass with no params', async () => {
    // Arrange
    const dtoObject = plainToInstance(UpdateRoleDto, {});

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
      const dtoObject = plainToInstance(UpdateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('name should not be empty');
    });

    it('should fail when name is not an enum', async () => {
      // Arrange
      const testDto: any = {
        name: 'test',
      };
      const dtoObject = plainToInstance(UpdateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'name must be a valid enum value',
      );
    });
  });

  /**
   * create
   */
  describe('create', () => {
    it('should fail when create is not a boolean', async () => {
      // Arrange
      const testDto: any = {
        create: 'test',
      };
      const dtoObject = plainToInstance(UpdateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'create must be a boolean value',
      );
    });
  });

  /**
   * read
   */
  describe('read', () => {
    it('should fail when read is not a boolean', async () => {
      // Arrange
      const testDto: any = {
        read: 'test',
      };
      const dtoObject = plainToInstance(UpdateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('read must be a boolean value');
    });
  });

  /**
   * update
   */
  describe('update', () => {
    it('should fail when update is not a boolean', async () => {
      // Arrange
      const testDto: any = {
        update: 'test',
      };
      const dtoObject = plainToInstance(UpdateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'update must be a boolean value',
      );
    });
  });

  /**
   * delete
   */
  describe('delete', () => {
    it('should fail when delete is not a boolean', async () => {
      // Arrange
      const testDto: any = {
        delete: 'test',
      };
      const dtoObject = plainToInstance(UpdateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'delete must be a boolean value',
      );
    });
  });
});
