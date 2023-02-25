import { HealthStatus } from '../../constants/record-health-status.enum';
import { RecordEntity } from '../../record.entity';
import { GetRecordsFilterDto } from '../../dtos/get-records-filter.dto';
import { Healthcare } from '../../constants/record-healthcare.enum';
import {
  userAdminStub,
  userEmployeeStub,
  userCustomerStub,
} from '../../../users/tests/mocks/user.stub';

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
const JANE_DOE_NAME = 'Jane Doe';
const JANE_DOE_DOB = '11/11/1111';
const JOHN_DOE_NAME = 'John Doe';
const JOHN_DOE_DOB = '22/22/2222';

export const janeDoePrimaryRecord: RecordEntity = {
  id: '4a3a9bd5-ee0f-406f-aeb6-5c4c77b460d2',
  name: JANE_DOE_NAME,
  dateOfBirth: JANE_DOE_DOB,
  typeOfCare: Healthcare.PRIMARY_HEALTHCARE,
  healthStatus: HealthStatus.EXCELLENT,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: userAdminStub,
};

const johnDoePrimaryRecord: RecordEntity = {
  id: '4a8993e0-7acd-4d25-827e-7888318d2744',
  name: JOHN_DOE_NAME,
  dateOfBirth: '22/22/2222',
  typeOfCare: Healthcare.PRIMARY_HEALTHCARE,
  healthStatus: HealthStatus.EXCELLENT,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: userEmployeeStub,
};

const johnDoeEmergencyRecord: RecordEntity = {
  id: '9cc8fe63-9721-4a68-863d-cc493eeb1ea8',
  name: JOHN_DOE_NAME,
  dateOfBirth: JOHN_DOE_DOB,
  typeOfCare: Healthcare.EMERGENCY_HEALTHCARE,
  healthStatus: HealthStatus.UNKNOWN,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: userCustomerStub,
};

export const recordsStub: RecordEntity[] = [
  janeDoePrimaryRecord,
  johnDoePrimaryRecord,
  johnDoeEmergencyRecord,
];

// Filter records by typeOfCare and healthStatus
export const getRecordsFilterDtoStub: GetRecordsFilterDto = {
  typeOfCare: Healthcare.PRIMARY_HEALTHCARE,
  search: HealthStatus.EXCELLENT,
};
export const recordsFilteredResultStub: RecordEntity[] = [johnDoePrimaryRecord];

// Filter records by typeOfCare
export const getRecordsFilterDtoByTypeStub: GetRecordsFilterDto = {
  typeOfCare: Healthcare.PRIMARY_HEALTHCARE,
};
export const recordsFilteredByTypeResultStub: RecordEntity[] = [
  johnDoeEmergencyRecord,
];

// Filter records by healthStatus
export const getRecordsFilterDtoByStatusStub: GetRecordsFilterDto = {
  search: 'EXCELLENT',
};
export const recordsFilteredByStatusResultStub: RecordEntity[] = [
  janeDoePrimaryRecord,
  johnDoePrimaryRecord,
];
