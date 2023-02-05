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

/**
 * Records Service - Supports CRUD operations for managing heath records.
 */
@Injectable()
export class RecordsService {
  private recordsRepository: Repository<RecordEntity>;
  private logger = new Logger('RecordsService', { timestamp: true });

  constructor(
    @InjectRepository(RecordEntity) recordsRepository: Repository<RecordEntity>,
  ) {
    this.recordsRepository = recordsRepository;
  }

  /**
   * Get Records Filter
   * @param getRecordsFilterDto
   * @returns filtered records
   */
  async getRecords(
    getRecordsFilterDto: GetRecordsFilterDto,
  ): Promise<RecordEntity[]> {
    const { typeOfCare, search } = getRecordsFilterDto;
    const query = this.recordsRepository.createQueryBuilder('record');

    if (typeOfCare) {
      query.andWhere('LOWER(record.typeOfCare) = LOWER(:typeOfCare)', {
        typeOfCare,
      });
    }

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

  /**
   * Get Record By ID
   * @param getRecordDto
   * @returns the record
   */
  async getRecord(getRecordDto: GetRecordDto): Promise<RecordEntity> {
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

  /**
   * Create Record
   * @param createRecordDto
   * @param user
   * @returns the record
   */
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

  /**
   * Update record with new health status
   * @param updateRecordDto
   * @param updateRecordHealthDto
   * @returns the record
   */
  async updateRecordHealthStatus(
    updateRecordDto: UpdateRecordDto,
    updateRecordHealthDto: UpdateRecordHealthDto,
  ): Promise<RecordEntity> {
    const { healthStatus } = updateRecordHealthDto;
    const record = await this.getRecord(updateRecordDto);
    record.healthStatus = healthStatus;

    await this.recordsRepository.save(record);

    return record;
  }

  /**
   * Delete Record
   * @param deleteRecordDto
   * @param user
   */
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
