import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { GetRoleByNameDto } from './dto/get-role-by-name.dto';
import { RoleEntity } from './role.entity';
import { DeleteRoleDto } from './dto/delete-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

/**
 * Roles Service - Supports role-based access control (RBAC)
 */
@Injectable()
export class RolesService {
  private rolesRepository: Repository<RoleEntity>;
  private logger = new Logger('RolesService', { timestamp: true });

  constructor(
    @InjectRepository(RoleEntity) rolesRepository: Repository<RoleEntity>,
  ) {
    this.rolesRepository = rolesRepository;
  }

  /**
   * Create Role [ ADMIN, EMPLOYEE, CUSTOMER ]
   * @param createRoleDto
   * @returns the role
   */
  async createRole(createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    const { name, create, read, update, del } = createRoleDto;

    try {
      const role = this.rolesRepository.create({
        name,
        create,
        read,
        update,
        delete: del,
      });

      await this.rolesRepository.save(role);

      return role;
    } catch (error) {
      // Postgres duplicate username error code
      if (error.code === '23505') {
        throw new ConflictException('Role already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Get Role by ID
   * @param getRoleDto
   * @returns the role
   */
  async getRole(getRoleDto: GetRoleDto): Promise<RoleEntity> {
    const { id } = getRoleDto;

    try {
      const role: RoleEntity = await this.rolesRepository.findOne({
        where: {
          id,
        },
      });

      if (!role) {
        throw new NotFoundException(`Role with ID: ${id} not found`);
      }

      return role;
    } catch (err) {
      this.logger.error(
        `Failed to get role: ${JSON.stringify(getRoleDto)}`,
        err.stack,
      );
      throw new NotFoundException(err.name, err.message);
    }
  }

  /**
   * Get Role by Name
   * @param getRoleByNameDto
   * @returns the role
   */
  async getRoleByName(getRoleByNameDto: GetRoleByNameDto): Promise<RoleEntity> {
    const { name } = getRoleByNameDto;

    try {
      const role: RoleEntity = await this.rolesRepository.findOne({
        where: {
          name,
        },
      });

      if (!role) {
        throw new NotFoundException(`Role: ${name}, not found`);
      }

      return role;
    } catch (err) {
      this.logger.error(
        `Failed to get role: ${JSON.stringify(getRoleByNameDto)}`,
        err.stack,
      );
      throw new NotFoundException(err.name, err.message);
    }
  }

  /**
   * Update Role
   * @param getRoleDto
   * @param updateRoleDto
   * @returns the user
   */
  async updateRole(
    getRoleDto: GetRoleDto,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleEntity> {
    const { name, create, read, update, del } = updateRoleDto;

    // Empty request body
    if (!name && !create && !read && !update && !del) {
      throw new BadRequestException();
    }

    // Retrieve role
    const role: RoleEntity = await this.getRole(getRoleDto);

    // Update name
    if (name) {
      role.name = name;
    }

    // Update create
    if (create) {
      role.create = create;
    }

    // Update read
    if (read) {
      role.read = read;
    }

    // Update update
    if (update) {
      role.update = update;
    }

    // Update delete
    if (del) {
      role.delete = del;
    }

    return await this.rolesRepository.save(role);
  }

  /**
   * Delete Role
   * @param deleteRoleDto
   */
  async deleteRole(deleteRoleDto: DeleteRoleDto): Promise<void> {
    const { id } = deleteRoleDto;

    const result = await this.rolesRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Role with ID: ${id} not found`);
    }

    return;
  }
}
