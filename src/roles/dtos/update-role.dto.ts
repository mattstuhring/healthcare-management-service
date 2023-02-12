import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { RoleName } from '../constants/role-name.enum';

export class UpdateRoleDto {
  @ApiProperty({
    enum: RoleName,
    description: 'This is a required property',
  })
  @IsOptional()
  @IsEnum(RoleName)
  name?: RoleName;

  @ApiProperty({
    type: Boolean,
    description: 'This is a required property',
  })
  @IsOptional()
  @IsBoolean()
  create?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'This is a required property',
  })
  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'This is a required property',
  })
  @IsOptional()
  @IsBoolean()
  update?: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'This is a required property',
  })
  @IsOptional()
  @IsBoolean()
  del?: boolean;
}
