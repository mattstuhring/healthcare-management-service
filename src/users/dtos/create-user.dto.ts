import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleName } from '../../roles/constants/role-name.enum';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsEmail()
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
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsString()
  dateOfBirth: string;

  @ApiPropertyOptional({
    enum: RoleName,
    description: 'This is an optional property',
  })
  @IsEnum(RoleName)
  roleName?: RoleName;
}
