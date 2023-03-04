import { HealthStatus } from '../../constants/record-health-status.enum';
import { RecordEntity } from '../../record.entity';
import { GetRecordsFilterDto } from '../../dtos/get-records-filter.dto';
import { Healthcare } from '../../constants/record-healthcare.enum';
import { userCustomerStub } from '../../../users/tests/mocks/user.stub';
import { CreateRecordDto } from '../../dtos/create-record.dto';
import { GetRecordDto } from '../../dtos/get-record.dto';
import { UpdateRecordDto } from '../../dtos/update-record.dto';
import { DeleteRecordDto } from 'src/records/dtos/delete-record.dto';
import { DeleteResult } from 'typeorm';

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
  typeOfCare: Healthcare.PRIMARY_HEALTHCARE,
  healthStatus: HealthStatus.EXCELLENT,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: userCustomerStub,
};

export const recordsStub: RecordEntity[] = [recordStub];

export const createRecordDtoStub: CreateRecordDto = {
  typeOfCare: Healthcare.MENTAL_HEALTHCARE,
  userId: userCustomerStub.id,
};

export const getRecordDtoStub: GetRecordDto = {
  id: 'ceb3415d-953e-4be5-b634-857b31bcda60',
};

// Get records - Filter by typeOfCare and healthStatus
export const getRecordsFilterDtoStub: GetRecordsFilterDto = {
  typeOfCare: Healthcare.PRIMARY_HEALTHCARE,
  search: HealthStatus.EXCELLENT,
};

// Get records - Filter by typeOfCare
export const getRecordsFilterDtoByTypeStub: GetRecordsFilterDto = {
  typeOfCare: Healthcare.PRIMARY_HEALTHCARE,
};

// Get records - Filter by healthStatus
export const getRecordsFilterDtoByStatusStub: GetRecordsFilterDto = {
  search: 'EXCELLENT',
};

export const updateRecordDtoStub: UpdateRecordDto = {
  healthStatus: HealthStatus.GOOD,
  typeOfCare: Healthcare.SPECIALTY_HEALTHCARE,
};

export const deleteRecordDtoStub: DeleteRecordDto = {
  id: '6498b1ff-ef2b-4165-ba69-7a9716622a68',
};

export const deleteResult: DeleteResult = { raw: [], affected: 1 };
