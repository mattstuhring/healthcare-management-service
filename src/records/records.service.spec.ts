import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetRecordsFilterDto } from './dto/get-records-filter.dto';
import { Healthcare } from './constants/record-healthcare.enum';
import { Record } from './record.entity';
import { RecordsService } from './records.service';
import { InternalServerErrorException } from '@nestjs/common';

const mockRecordsRepository = jest.fn(() => ({
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn(),
    getMany: jest.fn(),
  })),
}));

const createQueryBuilder: any = {
  andWhere: jest.fn(),
  getMany: jest.fn(),
};

describe('RecordsService', () => {
  let recordsService: RecordsService;
  let recordsRepository: Repository<Record>;
  let mockRecord: jest.Mocked<Record>;
  let mockGetRecordsFilterDto: jest.Mocked<GetRecordsFilterDto>;

  const REPOSITORY_TOKEN = getRepositoryToken(Record);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordsService,
        {
          provide: REPOSITORY_TOKEN,
          useFactory: mockRecordsRepository,
        },
      ],
    }).compile();

    recordsService = module.get<RecordsService>(RecordsService);
    recordsRepository = module.get<Repository<Record>>(REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRecords', () => {
    it('calls RecordsService.getRecords() and returns the result', async () => {
      const result: Record[] = [];
      const spy = jest
        .spyOn(recordsService, 'getRecords')
        .mockResolvedValue(result);

      const response = await recordsService.getRecords(mockGetRecordsFilterDto);

      expect(spy).toHaveBeenCalledWith(mockGetRecordsFilterDto);
      expect(response).toEqual(result);
    });

    it('should call RecordsRepository.createQueryBuilder() 1 time', async () => {
      const spy = jest.spyOn(recordsRepository, 'createQueryBuilder');

      await recordsService.getRecords({
        search: '',
        typeOfCare: Healthcare.EMERGENCY_HEALTHCARE,
      });

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should not call query.andWhere()', async () => {
      jest
        .spyOn(recordsRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const spy = jest.spyOn(
        recordsRepository.createQueryBuilder(),
        'andWhere',
      );

      await recordsService.getRecords({
        search: '',
        typeOfCare: null,
      });

      expect(spy).toBeCalledTimes(0);
    });

    it('should call query.andWhere() 1 time', async () => {
      jest
        .spyOn(recordsRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const spy = jest.spyOn(
        recordsRepository.createQueryBuilder(),
        'andWhere',
      );

      await recordsService.getRecords({
        search: '',
        typeOfCare: Healthcare.EMERGENCY_HEALTHCARE,
      });

      expect(spy).toBeCalledTimes(1);
    });

    it('should call query.andWhere() 2 times', async () => {
      jest
        .spyOn(recordsRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const spy = jest.spyOn(
        recordsRepository.createQueryBuilder(),
        'andWhere',
      );

      await recordsService.getRecords({
        search: 'test',
        typeOfCare: Healthcare.EMERGENCY_HEALTHCARE,
      });

      expect(spy).toBeCalledTimes(2);
    });

    it('should call query.getMany() 1 time', async () => {
      jest
        .spyOn(recordsRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const spy = jest.spyOn(recordsRepository.createQueryBuilder(), 'getMany');

      await recordsService.getRecords({
        search: 'test',
        typeOfCare: Healthcare.EMERGENCY_HEALTHCARE,
      });

      expect(spy).toBeCalledTimes(1);
    });

    it('should throw InternalServerErrorException when query.getMany() fails', async () => {
      jest
        .spyOn(recordsRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const spy = jest
        .spyOn(recordsRepository.createQueryBuilder(), 'getMany')
        .mockImplementationOnce(() => {
          throw new InternalServerErrorException();
        });

      try {
        await recordsService.getRecords(null);
      } catch (error) {
        expect(spy).toThrow(InternalServerErrorException);
      }
    });
  });
});
