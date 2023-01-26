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
import { Role } from 'src/roles/constants/role.enum';

@Injectable()
export class UsersService {
  private usersRepository: Repository<UserEntity>;
  private rolesRepository: Repository<RoleEntity>;

  constructor(
    @InjectRepository(UserEntity)
    usersRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    rolesRepository: Repository<RoleEntity>,
  ) {
    this.usersRepository = usersRepository;
    this.rolesRepository = rolesRepository;
  }

  // Access - Admin
  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const { username, password, role } = createUserDto;

    try {
      const salt = await bcrypt.genSalt(); // default 10 saltRounds
      const hashedPassword = await bcrypt.hash(password, salt);

      const match: RoleEntity = await this.rolesRepository.findOne({
        where: {
          name: role,
        },
      });

      if (!role) {
        throw new NotFoundException(`Role with ID: ${match.id} not found`);
      }

      const user = this.usersRepository.create({
        username,
        password: hashedPassword,
        role: match,
      });

      await this.usersRepository.save(user);
    } catch (err) {
      // Postgres duplicate username
      if (err.code === '23505') {
        throw new ConflictException('Username already exists');
      } else if (err instanceof NotFoundException) {
        console.log('Role not found: ', err.name, err.message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
