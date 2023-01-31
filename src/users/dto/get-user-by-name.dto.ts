import { IsString, IsNotEmpty } from 'class-validator';

export class GetUserByNameDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
