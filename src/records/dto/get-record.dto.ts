import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetRecordDto {
  @ApiProperty({
    type: String,
    name: 'id',
    description: 'This is a required property',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}
