import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { HealthStatus } from '../constants/record-health-status.enum';
import { Healthcare } from '../constants/record-healthcare.enum';

export class UpdateRecordDto {
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
