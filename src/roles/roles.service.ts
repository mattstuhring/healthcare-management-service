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
import { GetRolesDto } from './dto/get-roles.dto';
import { RoleEntity } from './role.entity';

@Injectable()
export class RolesService {
  private rolesRepository: Repository<RoleEntity>;
  private logger = new Logger('RolesService', { timestamp: true });

  constructor(
    @InjectRepository(RoleEntity) rolesRepository: Repository<RoleEntity>,
  ) {
    this.rolesRepository = rolesRepository;
  }

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
      // Postgres duplicate username
      if (error.code === '23505') {
        throw new ConflictException('Role already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

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

  async getRoles(getRolesDto: GetRolesDto): Promise<RoleEntity[]> {
    const { name } = getRolesDto;
    const query = this.rolesRepository.createQueryBuilder('role');

    if (name) {
      query.andWhere('LOWER(role.name) = LOWER(:name)', {
        name,
      });
    }

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get roles. Filters: ${JSON.stringify(getRolesDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
