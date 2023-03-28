import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Healthcare } from '../constants/record-healthcare.enum';

export class GetRecordsFilterDto {
  @ApiPropertyOptional({
    enum: Healthcare,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Healthcare)
  typeOfCare?: Healthcare;

  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  search?: string;
}
