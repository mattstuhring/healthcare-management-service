import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetRoleByIdDto } from './dto/get-role-by-id.dto';
import { GetRoleByNameDto } from './dto/get-role-by-name.dto';
import { RoleEntity } from './role.entity';

@Injectable()
export class RolesService {
  private rolesRepository: Repository<RoleEntity>;

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

  async getRoleById(getRoleByIdDto: GetRoleByIdDto): Promise<RoleEntity> {
    const { id } = getRoleByIdDto;

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
      console.error(err);
    }
  }

  async getRoleByName(getRoleByNameDto: GetRoleByNameDto): Promise<RoleEntity> {
    const { name } = getRoleByNameDto;

    try {
      const role: RoleEntity = await this.rolesRepository.findOne({
        where: {
          name,
        },
      });

      if (!role) {
        throw new NotFoundException(`Role with name: ${name} not found`);
      }

      return role;
    } catch (err) {
      console.error(err);
    }
  }
}
