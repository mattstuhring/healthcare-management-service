import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RoleName } from '../../roles/constants/role-name.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    enum: RoleName,
    description: 'This is an optional property',
  })
  @IsEnum(RoleName)
  @IsNotEmpty()
  @IsOptional()
  roleName?: RoleName;
}
