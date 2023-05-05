import {
  ConflictException,
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dtos/create-role.dto';
import { GetRoleDto } from './dtos/get-role.dto';
import { GetRoleByNameDto } from './dtos/get-role-by-name.dto';
import { RoleEntity } from './role.entity';
import { DeleteRoleDto } from './dtos/delete-role.dto';
import { UpdateRoleDto } from './dtos/update-role.dto';

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
    try {
      return await this.rolesRepository.save({
        ...createRoleDto,
      });
    } catch (err) {
      // Postgres duplicate role error code
      if (err.code === '23505') {
        throw new ConflictException(
          `Role ${createRoleDto.name} already exists`,
        );
      }

      throw err;
    }
  }

  /**
   * Get Role by ID
   * @param getRoleDto
   * @returns the role
   */
  async getRole(getRoleDto: GetRoleDto): Promise<RoleEntity> {
    const { id } = getRoleDto;

    const role = await this.rolesRepository.findOneBy({ id });

    if (!role) {
      throw new NotFoundException(`Role with ID: ${id} not found`);
    }

    return role;
  }

  /**
   * Get Role by Name
   * @param getRoleByNameDto
   * @returns the role
   */
  async getRoleByName(getRoleByNameDto: GetRoleByNameDto): Promise<RoleEntity> {
    const { name } = getRoleByNameDto;

    const role = await this.rolesRepository.findOneBy({ name });

    if (!role) {
      throw new NotFoundException(`Role: ${name}, not found`);
    }

    return role;
  }

  /**
   * Get Roles
   * @param
   * @returns
   */
  async getRoles(): Promise<RoleEntity[]> {
    return await this.rolesRepository.find();
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
    await this.rolesRepository.update(getRoleDto.id, updateRoleDto);

    return await this.getRole(getRoleDto);
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
  }
}
