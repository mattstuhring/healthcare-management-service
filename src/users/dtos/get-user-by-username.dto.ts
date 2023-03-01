import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class GetUserByUsernameDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsEmail()
  @IsNotEmpty()
  username: string;
}
