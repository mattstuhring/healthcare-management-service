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
import { RecordEntity } from './record.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { GetRecordDto } from './dto/get-record.dto';
import { DeleteRecordDto } from './dto/delete-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { UpdateRecordHealthDto } from './dto/update-record-health.dto';
import { GetRecordsFilterDto } from './dto/get-records-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../users/decorators/get-user.decorator';
import { UserEntity } from '../users/user.entity';
import { Roles } from '../roles/decorators/roles.decorator';
import { RoleName } from '../roles/constants/role-name.enum';
import { RolesGuard } from '../roles/roles.guard';

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
  ): Promise<RecordEntity[]> {
    return this.recordsService.getRecords(getRecordsFilterDto);
  }

  // Access - Admin, Employee
  @Get(':id')
  getRecordById(@Param() getRecordDto: GetRecordDto): Promise<RecordEntity> {
    return this.recordsService.getRecordById(getRecordDto);
  }

  // Access - Admin, Employee
  @Post()
  createRecord(
    @Body() createRecordDto: CreateRecordDto,
    @GetUser() user: UserEntity,
  ): Promise<RecordEntity> {
    this.logger.verbose(
      `User ${user.username} creating new record: ${JSON.stringify(
        createRecordDto,
      )}`,
    );
    return this.recordsService.createRecord(createRecordDto, user);
  }

  // Access - Admin, Employee
  @Patch(':id/health-status')
  updateRecordHealth(
    @Param() updateRecordDto: UpdateRecordDto,
    @Body() updateRecordHealthDto: UpdateRecordHealthDto,
  ): Promise<RecordEntity> {
    return this.recordsService.updateRecordHealthStatus(
      updateRecordDto,
      updateRecordHealthDto,
    );
  }

  // Access - Admin
  @UseGuards(RolesGuard)
  @Roles(RoleName.ADMIN)
  @Delete(':id')
  @HttpCode(204)
  deleteRecord(
    @Param() deleteRecordDto: DeleteRecordDto,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.recordsService.deleteRecord(deleteRecordDto, user);
  }
}
