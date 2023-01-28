import { IsNotEmpty, IsString } from 'class-validator';

export class GetRoleByIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
