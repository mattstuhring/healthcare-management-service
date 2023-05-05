import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { RoleName } from '../constants/role-name.enum';

export class UpdateRoleDto {
  @ApiPropertyOptional({
    enum: RoleName,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(RoleName)
  name?: RoleName;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  create?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  read?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  update?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  delete?: boolean;
}
