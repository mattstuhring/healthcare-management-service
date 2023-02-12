import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HealthStatus } from './constants/record-health-status.enum';
import { CreateRecordDto } from './dtos/create-record.dto';
import { GetRecordDto } from './dtos/get-record.dto';
import { DeleteRecordDto } from './dtos/delete-record.dto';
import { UpdateRecordDto } from './dtos/update-record.dto';
import { UpdateRecordHealthDto } from './dtos/update-record-health.dto';
import { GetRecordsFilterDto } from './dtos/get-records-filter.dto';
import { RecordEntity } from './record.entity';
import { UserEntity } from '../users/user.entity';
import { UsersService } from 'src/users/users.service';
import { GetUserDto } from 'src/users/dtos/get-user.dto';

/**
 * Records Service - Supports CRUD operations for managing heath records.
 */
@Injectable()
export class RecordsService {
  private recordsRepository: Repository<RecordEntity>;
  private userService: UsersService;
  private logger = new Logger('RecordsService', { timestamp: true });

  constructor(
    @InjectRepository(RecordEntity) recordsRepository: Repository<RecordEntity>,
    userService: UsersService,
  ) {
    this.recordsRepository = recordsRepository;
    this.userService = userService;
  }

  /**
   * Create Record
   * @param createRecordDto
   * @returns the record
   */
  async createRecord(createRecordDto: CreateRecordDto): Promise<RecordEntity> {
    const { name, dateOfBirth, typeOfCare, userId } = createRecordDto;

    const getUserDto: GetUserDto = new GetUserDto();
    getUserDto.id = userId;
    const user: UserEntity = await this.userService.getUser(getUserDto);

    const record = this.recordsRepository.create({
      name,
      dateOfBirth,
      typeOfCare,
      healthStatus: HealthStatus.UNKNOWN,
      updatedAt: new Date(),
      user,
    });

    return await this.recordsRepository.save(record);
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
   * Update record with new health status
   * @param getRecordDto
   * @param updateRecordHealthDto
   * @returns the record
   */
  async updateRecordHealthStatus(
    getRecordDto: GetRecordDto,
    updateRecordHealthDto: UpdateRecordHealthDto,
  ): Promise<RecordEntity> {
    const { healthStatus } = updateRecordHealthDto;

    const record = await this.getRecord(getRecordDto);
    record.healthStatus = healthStatus;

    return await this.recordsRepository.save(record);
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
    const { name, dateOfBirth, typeOfCare, healthStatus } = updateRecordDto;

    // Empty request body
    if (!name && !dateOfBirth && !typeOfCare && !healthStatus) {
      throw new BadRequestException();
    }

    // Retrieve record
    const record = await this.getRecord(getRecordDto);

    // Update name
    if (name) {
      record.name = name;
    }

    // Update date of birth
    if (dateOfBirth) {
      record.dateOfBirth = dateOfBirth;
    }

    // Update type of care
    if (typeOfCare) {
      record.typeOfCare = typeOfCare;
    }

    // Update health status
    if (healthStatus) {
      record.healthStatus = healthStatus;
    }

    return await this.recordsRepository.save(record);
  }

  /**
   * Delete Record
   * @param deleteRecordDto
   * @param user
   */
  async deleteRecord(deleteRecordDto: DeleteRecordDto): Promise<void> {
    const { id } = deleteRecordDto;
    const result = await this.recordsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Record with ID: ${id} not found`);
    }

    return;
  }
}
