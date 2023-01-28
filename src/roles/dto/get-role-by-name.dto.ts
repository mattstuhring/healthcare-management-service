import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../constants/role.enum';

export class GetRoleByNameDto {
  @IsNotEmpty()
  @IsEnum(Role)
  name: Role;
}
