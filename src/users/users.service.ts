import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleEntity } from '../roles/role.entity';
import { RolesService } from '../roles/roles.service';
import { GetUserByUsernameDto } from './dtos/get-user-by-username.dto';
import { GetUserDto } from './dtos/get-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { DeleteUserDto } from './dtos/delete-user.dto';
import { GetUsersDto } from './dtos/get-users.dto';

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
    const { password, roleName } = createUserDto;

    try {
      // Encrypt user password
      const hashedPassword: string = await this.encryptPassword(password);

      // Retrieve RBAC role to be assigned
      let role: RoleEntity = new RoleEntity();
      if (roleName) {
        role = await this.rolesService.getRoleByName({ name: roleName });
      }

      // Create the user entity
      return await this.usersRepository.save({
        ...createUserDto,
        password: hashedPassword,
        role,
      });
    } catch (err) {
      if (err.code === '23505') {
        // Postgres error code 23505 = duplicate username
        throw new ConflictException(
          `Username ${createUserDto.name} already exists`,
        );
      }

      throw err;
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
   * @param getUserByusernameDto
   * @returns the user
   */
  async getUserByUsername(
    getUserByusernameDto: GetUserByUsernameDto,
  ): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({
      ...getUserByusernameDto,
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  /**
   * Get Users - Supports filter by roleName
   * @param getUsersDto
   * @returns users
   */
  async getUsers(getUsersDto: GetUsersDto): Promise<UserEntity[]> {
    const { roleName } = getUsersDto;

    const query = this.usersRepository.createQueryBuilder('user');

    if (roleName) {
      const role: RoleEntity = await this.rolesService.getRoleByName({
        name: roleName,
      });

      query.where('user.role_id = :roleId', {
        roleId: role.id,
      });
    }

    return await query.getMany();
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
    const { roleName } = updateUserDto;

    // Retrieve user
    const user: UserEntity = await this.getUser(getUserDto);

    // Update user role
    if (roleName) {
      const role: RoleEntity = await this.rolesService.getRoleByName({
        name: roleName,
      });
      user.role = role;
    }

    delete updateUserDto.roleName;

    return await this.usersRepository.save({ ...user, ...updateUserDto });
  }

  /**
   * Delete User
   * @param deleteUserDto
   */
  async deleteUser(deleteUserDto: DeleteUserDto): Promise<void> {
    const { id } = deleteUserDto;

    const result = await this.usersRepository.delete(id);

    if (!result || result.affected === 0) {
      throw new NotFoundException(`User with ID: ${id} not found`);
    }
  }

  // Encrypt user password w/default 10 saltRounds
  private async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
