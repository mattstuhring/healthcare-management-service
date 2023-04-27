import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthLoginUserDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  /*
    REGEX:
      - Passwords will contain at least 1 upper case letter
      - Passwords will contain at least 1 lower case letter
      - Passwords will contain at least 1 number or special character
      - There is no length validation (min, max) in this regex!
  */
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
