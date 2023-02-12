import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { HealthStatus } from '../constants/record-health-status.enum';

export class UpdateRecordHealthDto {
  @ApiProperty({
    enum: HealthStatus,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsEnum(HealthStatus)
  healthStatus: HealthStatus;
}
