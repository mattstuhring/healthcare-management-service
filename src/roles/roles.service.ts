import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleDto } from './dto/get-role.dto';
import { GetRoleByNameDto } from './dto/get-role-by-name.dto';
import { RoleEntity } from './role.entity';

/*
  Roles Service - Supports role-based access control (RBAC) 
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

  /*
    Create Role [ ADMIN, EMPLOYEE, CUSTOMER ]
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

  /*
    Get Role By ID
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

  /*
    Get Role By Name
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
}
