import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthStatus } from '../constants/record-health-status.enum';
import { CreateRecordDto } from '../dtos/create-record.dto';
import { GetRecordDto } from '../dtos/get-record.dto';
import { DeleteRecordDto } from '../dtos/delete-record.dto';
import { UpdateRecordDto } from '../dtos/update-record.dto';
import { GetRecordsFilterDto } from '../dtos/get-records-filter.dto';
import { RecordEntity } from '../entity/record.entity';
import { UserEntity } from '../../users/entity/user.entity';
import { UsersService } from '../../users/services/users.service';

/**
 * Records Service - Supports CRUD operations for managing heath records.
 */
@Injectable()
export class RecordsService {
  private recordsRepository: Repository<RecordEntity>;
  private usersService: UsersService;
  private logger = new Logger('RecordsService', { timestamp: true });

  constructor(
    @InjectRepository(RecordEntity) recordsRepository: Repository<RecordEntity>,
    usersService: UsersService,
  ) {
    this.recordsRepository = recordsRepository;
    this.usersService = usersService;
  }

  /**
   * Create Record
   * @param createRecordDto
   * @returns the record
   */
  async createRecord(createRecordDto: CreateRecordDto): Promise<RecordEntity> {
    const { typeOfCare, userId } = createRecordDto;

    const user: UserEntity = await this.usersService.getUser({
      id: userId,
    });

    if (!user) {
      throw new NotFoundException();
    }

    return await this.recordsRepository.save({
      typeOfCare,
      healthStatus: HealthStatus.UNKNOWN,
      updatedAt: new Date(),
      user,
    });
  }

  /**
   * Get Record By ID
   * @param getRecordDto
   * @returns the record
   */
  async getRecord(getRecordDto: GetRecordDto): Promise<RecordEntity> {
    const { id } = getRecordDto;

    const record = await this.recordsRepository.findOneBy({
      id,
    });

    if (!record) {
      throw new NotFoundException(`Record with ID: ${id} not found`);
    }

    return record;
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

    const query = this.recordsRepository
      .createQueryBuilder('record')
      .innerJoinAndSelect('record.user', 'user');

    if (typeOfCare) {
      query.andWhere('LOWER(record.typeOfCare) = LOWER(:typeOfCare)', {
        typeOfCare,
      });
    }

    if (search) {
      query.andWhere(
        'LOWER(user.name) = LOWER(:name) OR LOWER(record.healthStatus) = LOWER(:healthStatus)',
        { name: search, dateOfBirth: search, healthStatus: search },
      );
    }

    return await query.getMany();
  }

  /**
   * Update record
   * @param getRecordDto
   * @param updateRecordHealthDto
   * @returns the record
   */
  async updateRecord(
    getRecordDto: GetRecordDto,
    updateRecordDto: UpdateRecordDto,
  ): Promise<RecordEntity> {
    const { typeOfCare, healthStatus } = updateRecordDto;

    // Empty request body
    if (!typeOfCare && !healthStatus) {
      throw new BadRequestException();
    }

    // Retrieve record
    const record = await this.getRecord(getRecordDto);

    return await this.recordsRepository.save({ ...record, ...updateRecordDto });
  }

  /**
   * Delete Record
   * @param deleteRecordDto
   * @param user
   */
  async deleteRecord(deleteRecordDto: DeleteRecordDto): Promise<void> {
    const { id } = deleteRecordDto;
    const result = await this.recordsRepository.delete(id);

    if (!result || result.affected === 0) {
      throw new NotFoundException(`Record with ID: ${id} not found`);
    }
  }
}
