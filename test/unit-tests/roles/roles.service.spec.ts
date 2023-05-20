import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { RoleEntity } from '../../../src/roles/entity/role.entity';
import { RolesService } from '../../../src/roles/services/roles.service';
import { rolesRepositoryMock } from './mocks/roles.mock';
import {
  createRoleDtoStub,
  deleteResult,
  deleteRoleDtoStub,
  getRoleByNameDtoStub,
  getRoleDtoStub,
  roleCustomerStub,
  updateRoleDtoStub,
} from './mocks/roles.stub';

describe('RolesService', () => {
  let rolesService: RolesService;
  let rolesRepository: Repository<RoleEntity>;

  const ROLE_REPOSITORY_TOKEN = getRepositoryToken(RoleEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: ROLE_REPOSITORY_TOKEN,
          useFactory: rolesRepositoryMock,
        },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
    rolesRepository = module.get<Repository<RoleEntity>>(ROLE_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(rolesService).toBeDefined();
    expect(rolesRepository).toBeDefined();
  });

  /**
   * Create Role
   */
  describe('createRole()', () => {
    it('should return role', async () => {
      // Arrange
      const spy = jest.spyOn(rolesService, 'createRole');

      // Act
      const response = await rolesService.createRole(createRoleDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(createRoleDtoStub);
      expect(response).toEqual(roleCustomerStub);
    });

    it('should create & save role', async () => {
      // Act
      await rolesService.createRole(createRoleDtoStub);

      // Assert
      expect(rolesRepository.save).toBeCalledTimes(1);
    });

    it('should throw InternalServerErrorException', async () => {
      // Arrange
      const repoSaveSpy = jest
        .spyOn(rolesRepository, 'save')
        .mockImplementation(() => {
          throw new InternalServerErrorException();
        });

      try {
        await rolesService.createRole(createRoleDtoStub);
      } catch (error) {
        expect(repoSaveSpy).toThrow(InternalServerErrorException);
      }
    });
  });

  /**
   * Get Role
   */
  describe('getRole()', () => {
    it('should return role', async () => {
      // Arrange
      const spy = jest.spyOn(rolesService, 'getRole');

      // Act
      const response = await rolesService.getRole(getRoleDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(getRoleDtoStub);
      expect(response).toEqual(roleCustomerStub);
    });

    it('should retrieve role', async () => {
      // Arrange
      const spy = jest.spyOn(rolesRepository, 'findOneBy');

      // Act
      await rolesService.getRole(getRoleDtoStub);

      // Assert
      expect(spy).toBeCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      // Arrange
      jest.spyOn(rolesRepository, 'findOneBy').mockResolvedValue(null);

      // Act & Assert
      await expect(rolesService.getRole(getRoleDtoStub)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  /**
   * Create Role by Name
   */
  describe('getRoleByName()', () => {
    it('should return role', async () => {
      // Arrange
      const spy = jest.spyOn(rolesService, 'getRoleByName');

      // Act
      const response = await rolesService.getRoleByName(getRoleByNameDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(getRoleByNameDtoStub);
      expect(response).toEqual(roleCustomerStub);
    });

    it('should retrieve role', async () => {
      // Arrange
      const spy = jest.spyOn(rolesRepository, 'findOneBy');

      // Act
      await rolesService.getRoleByName(getRoleByNameDtoStub);

      // Assert
      expect(spy).toBeCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      // Arrange
      jest.spyOn(rolesRepository, 'findOneBy').mockResolvedValue(null);

      // Act & Assert
      await expect(
        rolesService.getRoleByName(getRoleByNameDtoStub),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  /**
   * Update Role
   */
  describe('updateRole()', () => {
    it('should return role', async () => {
      // Arrange
      const spy = jest.spyOn(rolesService, 'updateRole');

      // Act
      const response = await rolesService.updateRole(
        getRoleDtoStub,
        updateRoleDtoStub,
      );

      // Assert
      expect(spy).toHaveBeenCalledWith(getRoleDtoStub, updateRoleDtoStub);
      expect(response).toEqual(roleCustomerStub);
    });

    it('should update role', async () => {
      // Arrange
      const spy = jest.spyOn(rolesRepository, 'update');

      // Act
      await rolesService.updateRole(getRoleDtoStub, updateRoleDtoStub);

      // Assert
      expect(spy).toBeCalledTimes(1);
    });

    it('should retrieve role', async () => {
      // Arrange
      const spy = jest.spyOn(rolesService, 'getRole');

      // Act
      await rolesService.updateRole(getRoleDtoStub, updateRoleDtoStub);

      // Assert
      expect(spy).toBeCalledTimes(1);
    });
  });

  it('should throw NotFoundException', async () => {
    // Arrange
    const spy = jest.spyOn(rolesRepository, 'update').mockImplementation(() => {
      throw new NotFoundException();
    });

    try {
      await rolesService.updateRole(getRoleDtoStub, updateRoleDtoStub);
    } catch (error) {
      expect(spy).toThrow(NotFoundException);
    }
  });

  it('should throw InternalServerErrorException', async () => {
    // Arrange
    const spy = jest.spyOn(rolesRepository, 'update').mockImplementation(() => {
      throw new InternalServerErrorException();
    });

    try {
      await rolesService.updateRole(getRoleDtoStub, updateRoleDtoStub);
    } catch (error) {
      expect(spy).toThrow(InternalServerErrorException);
    }
  });

  describe('deleteRecord()', () => {
    it('should return null', async () => {
      // Arrange
      const spy = jest.spyOn(rolesService, 'deleteRole');

      // Act
      const response = await rolesService.deleteRole(deleteRoleDtoStub);

      // Assert
      expect(spy).toBeCalledWith(deleteRoleDtoStub);
      expect(response).toBeNull;
    });

    it('should throw NotFoundException', async () => {
      // Arrange
      const result: DeleteResult = deleteResult;
      result.affected = 0;

      jest.spyOn(rolesRepository, 'delete').mockResolvedValue(result);

      // Act & Assert
      await expect(
        rolesService.deleteRole(deleteRoleDtoStub),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
