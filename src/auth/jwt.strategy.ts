import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { JwtPayload } from './dto/jwt-payload.interface';
import { UserEntity } from '../users/user.entity';
import { ConfigService } from '@nestjs/config';
import { GetUserByNameDto } from '../users/dto/get-user-by-name.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private usersService: UsersService;
  private configService: ConfigService;

  constructor(usersService: UsersService, configService: ConfigService) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });

    this.usersService = usersService;
    this.configService = configService;
  }

  async validate(jwtPayload: JwtPayload): Promise<UserEntity> {
    const { username } = jwtPayload;

    const getUserByNameDto: GetUserByNameDto = new GetUserByNameDto();
    getUserByNameDto.username = username;

    const user = await this.usersService.getUserByName(getUserByNameDto);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
