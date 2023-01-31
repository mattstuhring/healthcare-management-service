import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthStatus } from './constants/record-health-status.enum';
import { CreateRecordDto } from './dto/create-record.dto';
import { GetRecordDto } from './dto/get-record.dto';
import { DeleteRecordDto } from './dto/delete-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { UpdateRecordHealthDto } from './dto/update-record-health.dto';
import { GetRecordsFilterDto } from './dto/get-records-filter.dto';
import { RecordEntity } from './record.entity';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class RecordsService {
  private recordsRepository: Repository<RecordEntity>;
  private logger = new Logger('RecordsService', { timestamp: true });

  constructor(
    @InjectRepository(RecordEntity) recordsRepository: Repository<RecordEntity>,
  ) {
    this.recordsRepository = recordsRepository;
  }

  async getRecords(
    getRecordsFilterDto: GetRecordsFilterDto,
  ): Promise<RecordEntity[]> {
    const { typeOfCare, search } = getRecordsFilterDto;
    const query = this.recordsRepository.createQueryBuilder('record');

    // Case insensitive search using LOWER()
    if (typeOfCare) {
      query.andWhere('LOWER(record.typeOfCare) = LOWER(:typeOfCare)', {
        typeOfCare,
      });
    }

    // Case insensitive search using LOWER()
    if (search) {
      query.andWhere(
        'LOWER(record.name) = LOWER(:name) OR LOWER(record.dateOfBirth) = LOWER(:dateOfBirth) OR LOWER(record.healthStatus) = LOWER(:healthStatus)',
        { name: search, dateOfBirth: search, healthStatus: search },
      );
    }

    try {
      return await query.getMany();
    } catch (error) {
      this.logger.error(
        `Failed to get records. Filters: ${JSON.stringify(
          getRecordsFilterDto,
        )}`,
        error.stack,
      );

      throw new InternalServerErrorException();
    }
  }

  async getRecordById(getRecordDto: GetRecordDto): Promise<RecordEntity> {
    const { id } = getRecordDto;
    const record: RecordEntity = await this.recordsRepository.findOne({
      where: {
        id,
      },
    });

    if (!record) {
      throw new NotFoundException(`Record with ID: ${id} not found`);
    }

    return record;
  }

  async createRecord(
    createRecordDto: CreateRecordDto,
    user: UserEntity,
  ): Promise<RecordEntity> {
    const { name, dateOfBirth, typeOfCare } = createRecordDto;
    const record = this.recordsRepository.create({
      name,
      dateOfBirth,
      typeOfCare,
      healthStatus: HealthStatus.UNKNOWN,
      updatedAt: new Date(),
      user,
    });

    await this.recordsRepository.save(record);

    return record;
  }

  async updateRecordHealthStatus(
    updateRecordDto: UpdateRecordDto,
    updateRecordHealthDto: UpdateRecordHealthDto,
  ): Promise<RecordEntity> {
    const { healthStatus } = updateRecordHealthDto;
    const record = await this.getRecordById(updateRecordDto);
    record.healthStatus = healthStatus;

    await this.recordsRepository.save(record);

    return record;
  }

  async deleteRecord(
    deleteRecordDto: DeleteRecordDto,
    user: UserEntity,
  ): Promise<void> {
    if (user) {
      const { id } = deleteRecordDto;
      const result = await this.recordsRepository.delete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Record with ID: ${id} not found`);
      }
    } else {
      throw new UnauthorizedException();
    }
  }
}
