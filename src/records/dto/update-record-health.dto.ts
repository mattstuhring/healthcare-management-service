import { IsEnum } from 'class-validator';
import { HealthStatus } from '../constants/record-health-status.enum';

export class UpdateRecordHealthDto {
  @IsEnum(HealthStatus)
  healthStatus: HealthStatus;
}
