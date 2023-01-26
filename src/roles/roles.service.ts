import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
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
}
