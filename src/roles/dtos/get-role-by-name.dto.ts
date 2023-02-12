import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleName } from '../constants/role-name.enum';

export class GetRoleByNameDto {
  @ApiProperty({
    enum: RoleName,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsEnum(RoleName)
  name: RoleName;
}
