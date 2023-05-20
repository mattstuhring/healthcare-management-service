import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { RoleName } from '../../roles/constants/role.enum';

export class GetUsersDto {
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsEnum(RoleName)
  roleName: RoleName;
}
