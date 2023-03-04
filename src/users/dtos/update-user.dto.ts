import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
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
    type: String,
    description: 'This is an optional property',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    enum: RoleName,
    description: 'This is an optional property',
  })
  @IsEnum(RoleName)
  @IsOptional()
  roleName?: RoleName;
}
