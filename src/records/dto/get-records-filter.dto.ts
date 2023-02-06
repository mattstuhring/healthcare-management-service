import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Healthcare } from '../constants/record-healthcare.enum';

export class GetRecordsFilterDto {
  @ApiPropertyOptional({
    enum: Healthcare,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsEnum(Healthcare)
  typeOfCare?: Healthcare;

  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
