import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetRoleDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}
