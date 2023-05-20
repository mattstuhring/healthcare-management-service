import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { RecordEntity } from '../../../src/common/records/entity/record.entity';
import { RecordsService } from '../../../src/common/records/services/records.service';
import { UsersService } from '../../../src/common/users/services/users.service';
import { RolesService } from '../../../src/common/roles/services/roles.service';
import {
  createQueryBuilderMock,
  recordsRepositoryMock,
} from './mocks/records.mock';
import {
  createRecordDtoStub,
  deleteRecordDtoStub,
  deleteResult,
  getRecordDtoStub,
  getRecordsFilterDtoByStatusStub,
  getRecordsFilterDtoByTypeStub,
  getRecordsFilterDtoStub,
  recordsStub,
  recordStub,
  updateRecordDtoStub,
} from './mocks/records.stub';
import { GetRecordsFilterDto } from '../../../src/common/records/dtos/get-records-filter.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { userCustomerStub } from '../users/mocks/users.stub';
import { GetRecordDto } from '../../../src/common/records/dtos/get-record.dto';
import { UpdateRecordDto } from '../../../src/common/records/dtos/update-record.dto';
import { Healthcare } from '../../../src/common/records/constants/record-healthcare.enum';
import { HealthStatus } from '../../../src/common/records/constants/record-health-status.enum';

describe('RecordsService', () => {
  let recordsService: RecordsService;
  let recordsRepository: Repository<RecordEntity>;
  let usersService: UsersService;

  const RECORD_REPOSITORY_TOKEN = getRepositoryToken(RecordEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordsService,
        {
          provide: RECORD_REPOSITORY_TOKEN,
          useFactory: recordsRepositoryMock,
        },
        {
          provide: UsersService,
          useValue: {
            getUser: jest.fn().mockResolvedValue(userCustomerStub),
          },
        },
        {
          provide: RolesService,
          useValue: jest.fn(),
        },
      ],
    }).compile();

    recordsService = module.get<RecordsService>(RecordsService);
    recordsRepository = module.get<Repository<RecordEntity>>(
      RECORD_REPOSITORY_TOKEN,
    );
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(recordsService).toBeDefined();
    expect(recordsRepository).toBeDefined();
  });

  /**
   * Create Record
   */
  describe('createRecord()', () => {
    it('should return new record entity', async () => {
      // Arrange
      const spy = jest.spyOn(recordsService, 'createRecord');

      // Act
      const response = await recordsService.createRecord(createRecordDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(createRecordDtoStub);
      expect(response).toEqual(recordStub);
    });

    it('should call userService to retrieve userId', async () => {
      // Act
      await recordsService.createRecord(createRecordDtoStub);

      // Assert
      expect(usersService.getUser).toBeCalledTimes(1);
    });

    it('should create & save a new record', async () => {
      // Act
      await recordsService.createRecord(createRecordDtoStub);

      // Assert
      expect(recordsRepository.save).toBeCalledTimes(1);
    });
  });

  /**
   * Get Record
   */
  describe('getRecord()', () => {
    it('should return a record entity', async () => {
      // Arrange
      const spy = jest.spyOn(recordsService, 'getRecord');

      // Act
      const response = await recordsService.getRecord(getRecordDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(getRecordDtoStub);
      expect(response).toEqual(recordStub);
    });

    it('should call findOne one time', async () => {
      // Arrange
      const spy = jest.spyOn(recordsService, 'getRecord');

      // Act
      const response = await recordsService.getRecord(getRecordDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(getRecordDtoStub);
      expect(recordsRepository.findOneBy).toBeCalledTimes(1);
      expect(response).toEqual(recordStub);
    });

    it('should throw NotFoundException', async () => {
      // Arrange
      jest.spyOn(recordsRepository, 'findOneBy').mockResolvedValue(null);

      // Act & Assert
      await expect(
        recordsService.getRecord(new GetRecordDto()),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  /**
   * Get Records
   */
  describe('getRecords()', () => {
    beforeEach(() => {
      jest
        .spyOn(recordsRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock);
      jest
        .spyOn(createQueryBuilderMock, 'getMany')
        .mockImplementation(() => recordsStub);
    });

    it('should return array of records', async () => {
      // Arrange
      const spy = jest.spyOn(recordsService, 'getRecords');

      // Act
      const response = await recordsService.getRecords(getRecordsFilterDtoStub);

      // Assert
      expect(spy).toHaveBeenCalledWith(getRecordsFilterDtoStub);
      expect(recordsRepository.createQueryBuilder).toBeCalledTimes(1);
      expect(createQueryBuilderMock.andWhere).toBeCalledTimes(2);
      expect(createQueryBuilderMock.getMany).toBeCalledTimes(1);
      expect(response).toEqual(recordsStub);
    });

    it('should return filtered by typeOfCare response', async () => {
      // Arrange
      const spy = jest.spyOn(recordsService, 'getRecords');

      // Act
      const response = await recordsService.getRecords(
        getRecordsFilterDtoByTypeStub,
      );

      // Assert
      expect(spy).toHaveBeenCalledWith(getRecordsFilterDtoByTypeStub);
      expect(createQueryBuilderMock.andWhere).toBeCalledTimes(1);
      expect(response).toEqual(response);
    });

    it('should return filtered by healthStatus response', async () => {
      // Arrange
      const spy = jest.spyOn(recordsService, 'getRecords');

      // Act
      const response = await recordsService.getRecords(
        getRecordsFilterDtoByStatusStub,
      );

      // Assert
      expect(spy).toHaveBeenCalledWith(getRecordsFilterDtoByStatusStub);
      expect(createQueryBuilderMock.andWhere).toBeCalledTimes(1);
      expect(response).toEqual(response);
    });

    it('should return unfiltered response', async () => {
      // Arrange
      const result: RecordEntity[] = [];

      jest
        .spyOn(createQueryBuilderMock, 'getMany')
        .mockImplementation(() => result);

      const spy = jest.spyOn(recordsService, 'getRecords');

      // Act
      const response = await recordsService.getRecords(
        new GetRecordsFilterDto(),
      );

      // Assert
      expect(spy).toHaveBeenCalledWith(new GetRecordsFilterDto());
      expect(createQueryBuilderMock.andWhere).toBeCalledTimes(0);
      expect(response).toEqual(result);
    });
  });

  /**
   * Update Record
   */
  describe('updateRecord()', () => {
    it('should return record', async () => {
      // Arrange
      const spy = jest.spyOn(recordsService, 'updateRecord');

      // Act
      const response = await recordsService.updateRecord(
        getRecordDtoStub,
        updateRecordDtoStub,
      );

      // Assert
      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(getRecordDtoStub, updateRecordDtoStub);
      expect(response).toEqual(recordStub);
    });

    it('should retreive record', async () => {
      // Arrange
      jest.spyOn(recordsService, 'getRecord');

      // Act
      await recordsService.updateRecord(getRecordDtoStub, updateRecordDtoStub);

      // Assert
      expect(recordsService.getRecord).toBeCalledTimes(1);
      expect(recordsService.getRecord).toBeCalledWith(getRecordDtoStub);
    });

    it('should update record type of care', async () => {
      // Arrange
      const updatedRecord = { ...recordStub };
      updatedRecord.typeOfCare = Healthcare.SPECIALTY_HEALTHCARE;

      // Act
      await recordsService.updateRecord(getRecordDtoStub, updatedRecord);

      // Assert
      expect(recordsRepository.save).toBeCalledTimes(1);
      expect(recordsRepository.save).toBeCalledWith(updatedRecord);
    });

    it('should update record health status', async () => {
      // Arrange
      const updatedRecord = { ...recordStub };
      updatedRecord.healthStatus = HealthStatus.EXCELLENT;

      // Act
      await recordsService.updateRecord(getRecordDtoStub, updatedRecord);

      // Assert
      expect(recordsRepository.save).toBeCalledTimes(1);
      expect(recordsRepository.save).toBeCalledWith(updatedRecord);
    });

    it('should throw BadRequestException', async () => {
      // Act & Assert
      await expect(
        recordsService.updateRecord(new GetRecordDto(), new UpdateRecordDto()),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('deleteRecord()', () => {
    it('should delete record', async () => {
      // Arrange
      const spy = jest.spyOn(recordsService, 'deleteRecord');

      // Act
      const response = await recordsService.deleteRecord(deleteRecordDtoStub);

      // Assert
      expect(spy).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(deleteRecordDtoStub);
      expect(response).toBeNull;
    });

    it('should throw NotFoundException', async () => {
      // Arrange
      const result: DeleteResult = deleteResult;
      result.affected = 0;

      jest.spyOn(recordsRepository, 'delete').mockResolvedValue(result);

      // Act & Assert
      await expect(
        recordsService.deleteRecord(deleteRecordDtoStub),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
