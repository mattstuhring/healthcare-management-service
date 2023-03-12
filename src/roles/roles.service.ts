import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  BadRequestException,
  UnprocessableEntityException,
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
      if (error.code === '23505') {
        // Postgres duplicate role error code
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

    const role: RoleEntity = await this.rolesRepository.findOne({
      where: {
        id,
      },
    });

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

    const role: RoleEntity = await this.rolesRepository.findOne({
      where: {
        name,
      },
    });

    if (!role) {
      throw new NotFoundException(`Role: ${name}, not found`);
    }

    return role;
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
    try {
      await this.rolesRepository.update({ id: getRoleDto.id }, updateRoleDto);

      return await this.getRole(getRoleDto);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException();
      }
    }
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
