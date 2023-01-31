import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleEntity } from '../roles/role.entity';
import { RolesService } from 'src/roles/roles.service';
import { GetRolesDto } from 'src/roles/dto/get-roles.dto';
import { GetUserByNameDto } from './dto/get-user-by-name.dto';

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

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, password, role } = createUserDto;
    const getRolesDto = new GetRolesDto();
    getRolesDto.name = role;

    try {
      const salt = await bcrypt.genSalt(); // default 10 saltRounds
      const hashedPassword = await bcrypt.hash(password, salt);

      const roles: RoleEntity[] = await this.rolesService.getRoles(getRolesDto);
      const role: RoleEntity = roles[0];

      if (!role) {
        throw new NotFoundException('Role not found: ', JSON.stringify(role));
      }

      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
        role,
      });

      await this.usersRepository.save(user);
    } catch (err) {
      // Postgres duplicate username
      if (err.code === '23505') {
        throw new ConflictException('Username already exists');
      } else if (err instanceof NotFoundException) {
        console.log('Role not found: ', err.name, err.message);
        throw new NotFoundException(err.name, err.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getUserByName(getUserByNameDto: GetUserByNameDto): Promise<UserEntity> {
    const { username } = getUserByNameDto;
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
