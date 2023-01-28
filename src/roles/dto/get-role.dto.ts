import { IsNotEmpty, IsString } from 'class-validator';

export class GetRoleDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
