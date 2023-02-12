import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { HealthStatus } from '../constants/record-health-status.enum';
import { Healthcare } from '../constants/record-healthcare.enum';

export class UpdateRecordDto {
  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    type: String,
    description: 'This is an optional property',
  })
  @IsString()
  @IsNotEmpty()
  dateOfBirth?: string;

  @ApiPropertyOptional({
    enum: Healthcare,
    description: 'This is an optional property',
  })
  @IsEnum(Healthcare)
  @IsNotEmpty()
  typeOfCare?: Healthcare;

  @ApiPropertyOptional({
    enum: HealthStatus,
    description: 'This is an optional property',
  })
  @IsEnum(HealthStatus)
  @IsNotEmpty()
  healthStatus?: HealthStatus;
}
