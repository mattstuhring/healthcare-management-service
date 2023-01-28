import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleName } from '../constants/role-name.enum';

export class GetRolesDto {
  @IsNotEmpty()
  @IsEnum(RoleName)
  name: RoleName;
}
