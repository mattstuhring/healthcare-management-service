import { HealthStatus } from '../../constants/record-health-status.enum';
import { RecordEntity } from '../../record.entity';
import { GetRecordsFilterDto } from '../../dtos/get-records-filter.dto';
import { Healthcare } from '../../constants/record-healthcare.enum';
import { customerJohnDoeStub } from '../../../users/tests/mocks/user.stub';

/**
 * Stubs
 * Stubs are objects that return predefined values.
 * Like mocks, they don’t have working implementations.
 * However, unlike mocks, they are not programmed to expect specific calls.
 * Instead, they return values when they are called.
 *
 * Example
 * A stub might be programmed to always return the same value when called with any arguments.
 * Stubs are generally used to provide data that our code needs to run. This data can be hard-coded or generated dynamically.
 */
export const recordStub: RecordEntity = {
  id: '4a8993e0-7acd-4d25-827e-7888318d2744',
  name: 'John Doe',
  dateOfBirth: '11/11/1111',
  typeOfCare: Healthcare.PRIMARY_HEALTHCARE,
  healthStatus: HealthStatus.EXCELLENT,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: customerJohnDoeStub,
};

export const recordsStub: RecordEntity[] = [recordStub];

// Filter records by typeOfCare and healthStatus
export const getRecordsFilterDtoStub: GetRecordsFilterDto = {
  typeOfCare: Healthcare.PRIMARY_HEALTHCARE,
  search: HealthStatus.EXCELLENT,
};

// Filter records by typeOfCare
export const getRecordsFilterDtoByTypeStub: GetRecordsFilterDto = {
  typeOfCare: Healthcare.PRIMARY_HEALTHCARE,
};

// Filter records by healthStatus
export const getRecordsFilterDtoByStatusStub: GetRecordsFilterDto = {
  search: 'EXCELLENT',
};
