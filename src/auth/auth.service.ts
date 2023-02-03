import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthLoginUserDto } from './dto/auth-login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthJwtPayloadDto } from './dto/auth-jwt-payload.dto';
import { UsersService } from '../users/users.service';
import { GetUserByNameDto } from '../users/dto/get-user-by-name.dto';
import { UserEntity } from '../users/user.entity';
import { CreateCustomerDto } from '../users/dto/create-customer.dto';
import { AuthJwtDto } from './dto/auth-jwt.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RoleName } from '../roles/constants/role-name.enum';

@Injectable()
export class AuthService {
  private usersService: UsersService;
  private jwtService: JwtService;

  constructor(usersService: UsersService, jwtService: JwtService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
  }

  async customerSignup(
    createCustomerDto: CreateCustomerDto,
  ): Promise<UserEntity> {
    const { username, password } = createCustomerDto;

    const customer = new CreateUserDto();
    customer.password = password;
    customer.username = username;
    customer.role = RoleName.CUSTOMER;

    return await this.usersService.createUser(customer);
  }

  async login(authLoginUserDto: AuthLoginUserDto): Promise<AuthJwtDto> {
    const { username, password } = authLoginUserDto;

    const getUserByNameDto: GetUserByNameDto = new GetUserByNameDto();
    getUserByNameDto.username = username;

    try {
      const user = await this.usersService.getUserByName(getUserByNameDto);

      if (!user) {
        throw new Error();
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new Error();
      }

      const payload: AuthJwtPayloadDto = { username, role: user.role.name };
      const accessToken: string = this.jwtService.sign(payload);
      const authJwtDto: AuthJwtDto = { accessToken };

      return authJwtDto;
    } catch (err) {
      throw new UnauthorizedException(
        'Username or password may be incorrect. Please try again',
      );
    }
  }

  getToken(request: { headers: Record<string, string | string[]> }): string {
    const authorization = request.headers['authorization'];

    if (!authorization || Array.isArray(authorization)) {
      throw new Error('Invalid Authorization Header');
    }

    const [_, token] = authorization.split(' ');
    return token;
  }
}
