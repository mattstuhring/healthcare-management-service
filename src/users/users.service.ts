import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleEntity } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';
import { GetRoleByNameDto } from '../roles/dtos/get-role-by-name.dto';
import { GetUserByNameDto } from './dtos/get-user-by-name.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';

/**
 * User Service - Supports user creation and management.
 */
@Injectable()
export class UsersService {
  private usersRepository: Repository<UserEntity>;
  private rolesService: RolesService;

  constructor(
    @InjectRepository(UserEntity)
    usersRepository: Repository<UserEntity>,
    rolesService: RolesService,
  ) {
    this.usersRepository = usersRepository;
    this.rolesService = rolesService;
  }

  /**
   * Create User
   * @param createUserDto
   * @returns the user
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, password, role } = createUserDto;
    const getRoleByNameDto = new GetRoleByNameDto();
    getRoleByNameDto.name = role;

    try {
      // Encrypt user password
      const salt = await bcrypt.genSalt(); // default 10 saltRounds
      const hashedPassword = await bcrypt.hash(password, salt);

      // Retrieve RBAC role to be assigned
      const role: RoleEntity = await this.rolesService.getRoleByName(
        getRoleByNameDto,
      );

      if (!role) {
        throw new NotFoundException('Role not found: ', JSON.stringify(role));
      }

      // Create the user entity
      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
        role,
      });

      return await this.usersRepository.save(user);
    } catch (err) {
      // Postgres 23505 duplicate username error code
      if (err.code === '23505') {
        throw new ConflictException('Username already exists');
      } else if (err instanceof NotFoundException) {
        console.log('Role not found: ', err.name, err.message);
        throw new NotFoundException(err.name, err.message);
      } else {
        console.log(err);
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Get User by ID
   * @param getUserDto
   * @returns the user
   */
  async getUser(getUserDto: GetUserDto): Promise<UserEntity> {
    const { id } = getUserDto;

    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  /**
   * Get User by Name
   * @param getUserByNameDto
   * @returns the user
   */
  async getUserByName(getUserByNameDto: GetUserByNameDto): Promise<UserEntity> {
    const { username } = getUserByNameDto;

    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  /**
   * Update User
   * @param getUserDto
   * @param updateUserDto
   * @returns the user
   */
  async updateUser(
    getUserDto: GetUserDto,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const { username, roleName } = updateUserDto;

    // Empty request body
    if (!username && !roleName) {
      throw new BadRequestException();
    }

    // Retrieve user
    const user: UserEntity = await this.getUser(getUserDto);

    // Update username
    if (username) {
      user.username = username;
    }

    // Update user role
    if (roleName) {
      const getRoleByNameDto: GetRoleByNameDto = new GetRoleByNameDto();
      getRoleByNameDto.name = roleName;

      const role: RoleEntity = await this.rolesService.getRoleByName(
        getRoleByNameDto,
      );

      user.role = role;
    }

    return await this.usersRepository.save(user);
  }

  /**
   * Delete User
   * @param deleteUserDto
   */
  async deleteUser(deleteUserDto: DeleteUserDto): Promise<void> {
    const { id } = deleteUserDto;

    const result = await this.usersRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }

    return;
  }
}
