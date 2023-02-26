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
  getRecordsFilterDtoByStatusStub,
  getRecordsFilterDtoByTypeStub,
  getRecordsFilterDtoStub,
  recordsStub,
} from './mocks/records.stub';
import { GetRecordsFilterDto } from '../dtos/get-records-filter.dto';

describe('RecordsService', () => {
  let recordsService: RecordsService;
  let recordsRepository: Repository<RecordEntity>;

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
          useValue: jest.fn(),
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('RecordsService', () => {
    it('should be defined', () => {
      expect(recordsService).toBeDefined();
      expect(recordsRepository).toBeDefined();
    });
  });

  describe('getRecords()', () => {
    it('should return filtered by typeOfCare response', async () => {
      // Arrange
      jest
        .spyOn(recordsRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock);
      jest
        .spyOn(createQueryBuilderMock, 'getMany')
        .mockImplementation(() => recordsStub);

      const spy = jest.spyOn(recordsService, 'getRecords');

      // Act
      const response = await recordsService.getRecords(
        getRecordsFilterDtoByTypeStub,
      );

      // Assert
      expect(recordsRepository.createQueryBuilder).toBeCalledTimes(1);
      expect(createQueryBuilderMock.andWhere).toBeCalledTimes(1);
      expect(createQueryBuilderMock.getMany).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(getRecordsFilterDtoByTypeStub);
      expect(response).toEqual(recordsStub);
    });

    it('should return filtered by healthStatus response', async () => {
      // Arrange
      jest
        .spyOn(recordsRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock);
      jest
        .spyOn(createQueryBuilderMock, 'getMany')
        .mockImplementation(() => recordsStub);

      const spy = jest.spyOn(recordsService, 'getRecords');

      // Act
      const response = await recordsService.getRecords(
        getRecordsFilterDtoByStatusStub,
      );

      // Assert
      expect(recordsRepository.createQueryBuilder).toBeCalledTimes(1);
      expect(createQueryBuilderMock.andWhere).toBeCalledTimes(1);
      expect(createQueryBuilderMock.getMany).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(getRecordsFilterDtoByStatusStub);
      expect(response).toEqual(recordsStub);
    });

    it('should return filtered by typeOfCare and healthStatus response', async () => {
      // Arrange
      jest
        .spyOn(recordsRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock);
      jest
        .spyOn(createQueryBuilderMock, 'getMany')
        .mockImplementation(() => recordsStub);

      const spy = jest.spyOn(recordsService, 'getRecords');

      // Act
      const response = await recordsService.getRecords(getRecordsFilterDtoStub);

      // Assert
      expect(recordsRepository.createQueryBuilder).toBeCalledTimes(1);
      expect(createQueryBuilderMock.andWhere).toBeCalledTimes(2);
      expect(createQueryBuilderMock.getMany).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(getRecordsFilterDtoStub);
      expect(response).toEqual(recordsStub);
    });

    it('should return unfiltered response', async () => {
      // Arrange
      const result: RecordEntity[] = [];
      jest
        .spyOn(recordsRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilderMock);
      jest
        .spyOn(createQueryBuilderMock, 'getMany')
        .mockImplementation(() => result);

      const spy = jest.spyOn(recordsService, 'getRecords');

      // Act
      const response = await recordsService.getRecords(
        new GetRecordsFilterDto(),
      );

      // Assert
      expect(recordsRepository.createQueryBuilder).toBeCalledTimes(1);
      expect(createQueryBuilderMock.andWhere).toBeCalledTimes(0);
      expect(createQueryBuilderMock.getMany).toBeCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(new GetRecordsFilterDto());
      expect(response).toEqual(result);
    });
  });
});
