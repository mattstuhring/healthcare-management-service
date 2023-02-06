import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
