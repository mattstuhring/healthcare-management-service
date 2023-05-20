import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesService } from '../../../src/roles/services/roles.service';
import { DeleteResult, Repository } from 'typeorm';
import { UserEntity } from '../../../src/users/entity/user.entity';
import { UsersService } from '../../../src/users/services/users.service';
import { usersRepositoryMock } from './mocks/users.mock';
import {
  createUserDtoStub,
  deleteResult,
  deleteUserDtoStub,
  getUserByUsernameDtoStub,
  getUserDtoStub,
  updateUserDtoStub,
  userCustomerStub,
} from './mocks/users.stub';
import { roleAdminStub, roleCustomerStub } from '../roles/mocks/roles.stub';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '../../../src/users/dtos/update-user.dto';
import { RoleName } from '../../../src/roles/constants/role.enum';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<UserEntity>;
  let rolesService: RolesService;

  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useFactory: usersRepositoryMock,
        },
        {
          provide: RolesService,
          useValue: {
            getRoleByName: jest.fn().mockResolvedValue(roleCustomerStub),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<UserEntity>>(USER_REPOSITORY_TOKEN);
    rolesService = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  /**
   * Create User
   */
  describe('createUser()', () => {
    it('should return new user', async () => {
      // Arrange
      const spy = jest.spyOn(usersService, 'createUser');

      // Act
      const response = await usersService.createUser(createUserDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(createUserDtoStub);
      expect(response).toEqual(userCustomerStub);
    });

    it('should encrypt password', async () => {
      // Arrange
      const hashedPassword = 'abc123';
      const encryptPasswordSpy = jest
        .spyOn(UsersService.prototype as any, 'encryptPassword')
        .mockReturnValue(hashedPassword);

      // Act
      await usersService.createUser(createUserDtoStub);

      // Assert
      expect(encryptPasswordSpy).toBeCalledTimes(1);
      expect(encryptPasswordSpy).toReturnWith(hashedPassword);
    });

    it('should retrieve role by name', async () => {
      // Arrange
      const getRoleByNameSpy = jest.spyOn(rolesService, 'getRoleByName');

      const userDto = { ...createUserDtoStub, roleName: RoleName.ADMIN };

      // Act
      await usersService.createUser(userDto);

      // Assert
      expect(getRoleByNameSpy).toBeCalledTimes(1);
    });

    it('should save user', async () => {
      // Arrange
      const hashedPassword = 'abc123';
      const result: UserEntity = userCustomerStub;
      result.password = hashedPassword;
      jest
        .spyOn(UsersService.prototype as any, 'encryptPassword')
        .mockReturnValue(hashedPassword);

      const repoSaveSpy = jest.spyOn(usersRepository, 'save');

      // Act
      await usersService.createUser(createUserDtoStub);
      userCustomerStub.password = hashedPassword;

      // Assert
      expect(repoSaveSpy).toBeCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      // Arrange
      const repoSaveSpy = jest
        .spyOn(usersRepository, 'save')
        .mockImplementation(() => {
          throw new NotFoundException();
        });

      try {
        await usersService.createUser(createUserDtoStub);
      } catch (error) {
        expect(repoSaveSpy).toThrow(NotFoundException);
      }
    });

    it('should throw InternalServerErrorException', async () => {
      // Arrange
      const repoSaveSpy = jest
        .spyOn(usersRepository, 'save')
        .mockImplementation(() => {
          throw new InternalServerErrorException();
        });

      try {
        await usersService.createUser(createUserDtoStub);
      } catch (error) {
        expect(repoSaveSpy).toThrow(InternalServerErrorException);
      }
    });
  });

  /**
   * Get User
   */
  describe('getUser()', () => {
    it('should return user', async () => {
      // Arrange
      const spy = jest.spyOn(usersService, 'getUser');

      // Act
      const response = await usersService.getUser(getUserDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(getUserDtoStub);
      expect(response).toEqual(userCustomerStub);
    });

    it('should retrieve user', async () => {
      // Arrange
      const spy = jest.spyOn(usersRepository, 'findOneBy');

      // Act
      await usersService.getUser(getUserDtoStub);

      // Assert
      expect(spy).toBeCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      // Arrange
      const spy = jest
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(null);

      // Act & Assert
      await expect(usersService.getUser(getUserDtoStub)).rejects.toThrowError(
        NotFoundException,
      );
      expect(spy).toBeCalledTimes(1);
    });
  });

  /**
   * Get User By Username
   */
  describe('getUserByUsername()', () => {
    it('should return user', async () => {
      // Arrange
      const spy = jest.spyOn(usersService, 'getUserByUsername');

      // Act
      const response = await usersService.getUserByUsername(
        getUserByUsernameDtoStub,
      );

      // Assert
      expect(spy).toHaveBeenCalledWith(getUserByUsernameDtoStub);
      expect(response).toEqual(userCustomerStub);
    });

    it('should retrieve user', async () => {
      // Arrange
      const spy = jest.spyOn(usersRepository, 'findOneBy');

      // Act
      await usersService.getUserByUsername(getUserByUsernameDtoStub);

      // Assert
      expect(spy).toBeCalledTimes(1);
    });

    it('should throw NotFoundException', async () => {
      // Arrange
      const spy = jest
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(null);

      // Act & Assert
      await expect(
        usersService.getUserByUsername(getUserByUsernameDtoStub),
      ).rejects.toThrowError(NotFoundException);
      expect(spy).toBeCalledTimes(1);
    });
  });

  /**
   * Update User
   */
  describe('updateUser()', () => {
    it('should return user', async () => {
      // Arrange
      const spy = jest.spyOn(usersService, 'updateUser');

      // Act
      const response = await usersService.updateUser(
        getUserDtoStub,
        updateUserDtoStub,
      );

      // Assert
      expect(spy).toHaveBeenCalledWith(getUserDtoStub, updateUserDtoStub);
      expect(response).toEqual(userCustomerStub);
    });

    it('should update user', async () => {
      // Arrange
      const updatedUser = { ...userCustomerStub };
      updatedUser.name = 'Jane Doe';
      updatedUser.dateOfBirth = '22/22/2222';
      updatedUser.username = 'janedoe@email.com';
      updatedUser.role = roleAdminStub;

      const spy = jest.spyOn(usersRepository, 'save');

      // Act
      await usersService.updateUser(getUserDtoStub, updatedUser);

      // Assert
      expect(spy).toHaveBeenCalledWith(updatedUser);
    });

    it('should retrieve user', async () => {
      // Arrange
      const spy = jest.spyOn(usersService, 'getUser');

      // Act
      await usersService.updateUser(getUserDtoStub, updateUserDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(getUserDtoStub);
      expect(spy).toBeCalledTimes(1);
    });

    it('should retrieve role by name', async () => {
      // Arrange

      const payload: UpdateUserDto = {
        name: 'Jane Doe',
        dateOfBirth: '22/22/2222',
        username: 'janedoe@email.com',
        roleName: RoleName.CUSTOMER,
      };

      const spy = jest.spyOn(rolesService, 'getRoleByName');

      // Act
      await usersService.updateUser(getUserDtoStub, payload);

      // Assert
      expect(spy).toBeCalledTimes(1);
    });

    it('should not retrieve role', async () => {
      // Arrange
      const getRoleByNameSpy = jest.spyOn(rolesService, 'getRoleByName');

      // Act
      updateUserDtoStub.roleName = undefined;
      await usersService.updateUser(getUserDtoStub, updateUserDtoStub);

      // Assert
      expect(getRoleByNameSpy).toBeCalledTimes(0);
    });
  });

  describe('deleteUser()', () => {
    it('should delete record', async () => {
      // Arrange
      const spy = jest.spyOn(usersService, 'deleteUser');

      // Act
      const response = await usersService.deleteUser(deleteUserDtoStub);

      // Assert
      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(deleteUserDtoStub);
      expect(response).toBeNull;
    });

    it('should throw NotFoundException', async () => {
      // Arrange
      const result: DeleteResult = deleteResult;
      result.affected = 0;

      jest.spyOn(usersRepository, 'delete').mockResolvedValue(result);

      // Act & Assert
      await expect(
        usersService.deleteUser(deleteUserDtoStub),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
