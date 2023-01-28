import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { RoleName } from '../constants/role-name.enum';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsEnum(RoleName)
  name: RoleName;

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
