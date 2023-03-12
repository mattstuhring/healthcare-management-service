import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { RoleName } from '../constants/role-name.enum';

export class UpdateRoleDto {
  @ApiPropertyOptional({
    enum: RoleName,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsEnum(RoleName)
  name?: RoleName;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsBoolean()
  create?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsBoolean()
  update?: boolean;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsBoolean()
  del?: boolean;
}
