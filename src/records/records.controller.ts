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
import { GetUser } from '../users/decorators/get-user.decorator';
import { UserEntity } from '../users/user.entity';
import { Roles } from '../roles/decorators/roles.decorator';
import { RoleName } from '../roles/constants/role-name.enum';
import { RolesGuard } from '../roles/roles.guard';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';

@Controller('records')
@UseGuards(AuthJwtGuard)
@UseGuards(RolesGuard)
export class RecordsController {
  private recordsService: RecordsService;
  private logger = new Logger('RecordsController');

  constructor(recordsService: RecordsService) {
    this.recordsService = recordsService;
  }

  @Get(':id')
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getRecord(@Param() getRecordDto: GetRecordDto): Promise<RecordEntity> {
    return this.recordsService.getRecord(getRecordDto);
  }

  @Get()
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getRecords(
    @Query() getRecordsFilterDto: GetRecordsFilterDto,
  ): Promise<RecordEntity[]> {
    return this.recordsService.getRecords(getRecordsFilterDto);
  }

  @Post()
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
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

  @Patch(':id/health-status')
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  updateRecordHealth(
    @Param() updateRecordDto: UpdateRecordDto,
    @Body() updateRecordHealthDto: UpdateRecordHealthDto,
  ): Promise<RecordEntity> {
    return this.recordsService.updateRecordHealthStatus(
      updateRecordDto,
      updateRecordHealthDto,
    );
  }

  @Delete(':id')
  @Roles(RoleName.ADMIN)
  @HttpCode(204)
  deleteRecord(
    @Param() deleteRecordDto: DeleteRecordDto,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.recordsService.deleteRecord(deleteRecordDto, user);
  }
}
