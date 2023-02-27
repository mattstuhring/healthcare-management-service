import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordEntity } from '../record.entity';
import { RecordsService } from '../records.service';
import { UsersService } from '../../users/users.service';
import { RolesService } from '../../roles/roles.service';
import {
  createQueryBuilderMock,
  recordsRepositoryMock,
} from './mocks/records.mock';
import {
  createRecordDtoStub,
  getRecordsFilterDtoByStatusStub,
  getRecordsFilterDtoByTypeStub,
  getRecordsFilterDtoStub,
  recordsStub,
  recordStub,
} from './mocks/records.stub';
import { GetRecordsFilterDto } from '../dtos/get-records-filter.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { userCustomerStub } from '../../users/tests/mocks/user.stub';

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
      expect(recordsRepository.create).toBeCalledTimes(1);
      expect(recordsRepository.save).toBeCalledTimes(1);
    });
  });

  describe('getRecords()', () => {
    beforeEach(() => {
      jest
        .spyOn(recordsRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock);
      jest
        .spyOn(createQueryBuilderMock, 'getMany')
        .mockImplementation(() => recordsStub);
    });

    it('should return record entity array', async () => {
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

    it('should throw InternalServerError exception', async () => {
      // Arrange
      jest
        .spyOn(createQueryBuilderMock, 'getMany')
        .mockRejectedValue(new Error());

      // Act & Assert
      await expect(
        recordsService.getRecords(new GetRecordsFilterDto()),
      ).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
