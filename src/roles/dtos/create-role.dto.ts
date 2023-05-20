import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { RoleName } from '../constants/role.enum';

export class CreateRoleDto {
  @ApiProperty({
    enum: RoleName,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsEnum(RoleName)
  name: RoleName;

  @ApiProperty({
    type: Boolean,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsBoolean()
  create: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsBoolean()
  read: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsBoolean()
  update: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsBoolean()
  delete: boolean;
}
