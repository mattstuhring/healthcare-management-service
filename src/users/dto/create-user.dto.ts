import {
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RoleName } from '../../roles/constants/role-name.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  /*
    REGEX:
      - Passwords will contain at least 1 upper case letter
      - Passwords will contain at least 1 lower case letter
      - Passwords will contain at least 1 number or special character
      - There is no length validation (min, max) in this regex!
  */
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @IsEnum(RoleName)
  roleName: RoleName;
}
