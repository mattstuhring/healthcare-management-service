import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetUserDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
