import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RoleName } from '../../../../src/common/roles/constants/role.enum';
import { CreateRoleDto } from '../../../../src/common/roles/dtos/create-role.dto';
import { createRoleDtoStub } from '../mocks/roles.stub';

describe('CreateRoleDto', () => {
  let dto: CreateRoleDto;

  beforeEach(() => {
    dto = {
      name: createRoleDtoStub.name,
      create: createRoleDtoStub.create,
      read: createRoleDtoStub.read,
      update: createRoleDtoStub.update,
      delete: createRoleDtoStub.delete,
    };
  });

  it('should pass', async () => {
    // Arrange
    const dtoObject = plainToInstance(CreateRoleDto, dto);

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
        create: createRoleDtoStub.create,
        read: createRoleDtoStub.read,
        update: createRoleDtoStub.update,
        delete: createRoleDtoStub.delete,
      };
      const dtoObject = plainToInstance(CreateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('name should not be empty');
    });

    it('should pass when name is an enum', async () => {
      // Arrange
      dto.name = RoleName.ADMIN;
      const dtoObject = plainToInstance(CreateRoleDto, dto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(errors.length).toBe(0);
    });

    it('should fail when name is not an enum', async () => {
      // Arrange
      const testDto: any = {
        name: 'test',
        create: createRoleDtoStub.create,
        read: createRoleDtoStub.read,
        update: createRoleDtoStub.update,
        delete: createRoleDtoStub.delete,
      };
      const dtoObject = plainToInstance(CreateRoleDto, testDto);

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
    it('should fail when create is empty', async () => {
      // Arrange
      const testDto: any = {
        name: createRoleDtoStub.name,
        read: createRoleDtoStub.read,
        update: createRoleDtoStub.update,
        delete: createRoleDtoStub.delete,
      };
      const dtoObject = plainToInstance(CreateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('create should not be empty');
    });

    it('should fail when create is not a boolean', async () => {
      // Arrange
      const testDto: any = {
        name: createRoleDtoStub.name,
        create: 'test',
        read: createRoleDtoStub.read,
        update: createRoleDtoStub.update,
        delete: createRoleDtoStub.delete,
      };
      const dtoObject = plainToInstance(CreateRoleDto, testDto);

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
    it('should fail when read is empty', async () => {
      // Arrange
      const testDto: any = {
        name: createRoleDtoStub.name,
        create: createRoleDtoStub.create,
        update: createRoleDtoStub.update,
        delete: createRoleDtoStub.delete,
      };
      const dtoObject = plainToInstance(CreateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('read should not be empty');
    });

    it('should fail when read is not a boolean', async () => {
      // Arrange
      const testDto: any = {
        name: createRoleDtoStub.name,
        create: createRoleDtoStub.create,
        read: 'test',
        update: createRoleDtoStub.update,
        delete: createRoleDtoStub.delete,
      };
      const dtoObject = plainToInstance(CreateRoleDto, testDto);

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
    it('should fail when update is empty', async () => {
      // Arrange
      const testDto: any = {
        name: createRoleDtoStub.name,
        create: createRoleDtoStub.create,
        read: createRoleDtoStub.read,
        delete: createRoleDtoStub.delete,
      };
      const dtoObject = plainToInstance(CreateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('update should not be empty');
    });

    it('should fail when update is not a boolean', async () => {
      // Arrange
      const testDto: any = {
        name: createRoleDtoStub.name,
        create: createRoleDtoStub.create,
        read: createRoleDtoStub.read,
        update: 'test',
        delete: createRoleDtoStub.delete,
      };
      const dtoObject = plainToInstance(CreateRoleDto, testDto);

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
    it('should fail when delete is empty', async () => {
      // Arrange
      const testDto: any = {
        name: createRoleDtoStub.name,
        create: createRoleDtoStub.create,
        read: createRoleDtoStub.read,
        update: createRoleDtoStub.update,
      };
      const dtoObject = plainToInstance(CreateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain('delete should not be empty');
    });

    it('should fail when delete is not a boolean', async () => {
      // Arrange
      const testDto: any = {
        name: createRoleDtoStub.name,
        create: createRoleDtoStub.create,
        read: createRoleDtoStub.read,
        update: createRoleDtoStub.update,
        del: 'test',
      };
      const dtoObject = plainToInstance(CreateRoleDto, testDto);

      // Act
      const errors = await validate(dtoObject);

      // Assert
      expect(JSON.stringify(errors)).toContain(
        'delete must be a boolean value',
      );
    });
  });
});
