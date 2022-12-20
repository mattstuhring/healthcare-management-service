import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpCode,
  Patch,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { RecordsService } from './records.service';
import { Record } from './record.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { GetRecordDto } from './dto/get-record.dto';
import { DeleteRecordDto } from './dto/delete-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { UpdateRecordHealthDto } from './dto/update-record-health.dto';
import { GetRecordsFilterDto } from './dto/get-records-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '../users/user.entity';

@Controller('records')
@UseGuards(AuthGuard())
export class RecordsController {
  private recordsService: RecordsService;
  private logger = new Logger('RecordsController');

  constructor(recordsService: RecordsService) {
    this.recordsService = recordsService;
  }

  // Access - Admin, Employee
  @Get()
  getRecords(
    @Query() getRecordsFilterDto: GetRecordsFilterDto,
  ): Promise<Record[]> {
    return this.recordsService.getRecords(getRecordsFilterDto);
  }

  // Access - Admin, Employee
  @Get('/:id')
  getRecordById(@Param() getRecordDto: GetRecordDto): Promise<Record> {
    return this.recordsService.getRecordById(getRecordDto);
  }

  // Access - Admin, Employee
  @Post()
  createRecord(
    @Body() createRecordDto: CreateRecordDto,
    @GetUser() user: User,
  ): Promise<Record> {
    this.logger.verbose(
      `User ${user.username} creating new record: ${JSON.stringify(
        createRecordDto,
      )}`,
    );
    return this.recordsService.createRecord(createRecordDto, user);
  }

  // Access - Admin, Employee
  @Patch('/:id/health/status')
  updateRecordHealth(
    @Param() updateRecordDto: UpdateRecordDto,
    @Body() updateRecordHealthDto: UpdateRecordHealthDto,
  ): Promise<Record> {
    return this.recordsService.updateRecordHealthStatus(
      updateRecordDto,
      updateRecordHealthDto,
    );
  }

  // Access - Admin
  @Delete('/:id')
  @HttpCode(204)
  deleteRecord(
    @Param() deleteRecordDto: DeleteRecordDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.recordsService.deleteRecord(deleteRecordDto, user);
  }
}
