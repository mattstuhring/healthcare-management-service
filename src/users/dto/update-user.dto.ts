import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { RoleName } from '../../roles/constants/role-name.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsEmail()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    enum: RoleName,
    description: 'This is an optional property',
  })
  @IsEnum(RoleName)
  @IsOptional()
  roleName?: RoleName;
}
