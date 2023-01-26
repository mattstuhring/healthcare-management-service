import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../constants/role.enum';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsEnum(Role)
  name: Role;

  @IsNotEmpty()
  @IsBoolean()
  create: boolean;

  @IsNotEmpty()
  @IsBoolean()
  read: boolean;

  @IsNotEmpty()
  @IsBoolean()
  update: boolean;

  @IsNotEmpty()
  @IsBoolean()
  del: boolean;
}
