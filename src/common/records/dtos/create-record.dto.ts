import { Healthcare } from '../constants/record-healthcare.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecordDto {
  @ApiProperty({
    enum: Healthcare,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsEnum(Healthcare)
  typeOfCare: Healthcare;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
