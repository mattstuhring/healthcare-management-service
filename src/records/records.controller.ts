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
import { Roles } from '../roles/decorators/roles.decorator';
import { RoleName } from '../roles/constants/role-name.enum';
import { RolesGuard } from '../roles/roles.guard';
import { AuthJwtGuard } from '../auth/auth-jwt.guard';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Records')
@Controller('records')
@UseGuards(AuthJwtGuard)
@UseGuards(RolesGuard)
export class RecordsController {
  private recordsService: RecordsService;
  private logger = new Logger('RecordsController');

  constructor(recordsService: RecordsService) {
    this.recordsService = recordsService;
  }

  @Post()
  @ApiCreatedResponse({ description: 'Created Succesfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  @HttpCode(201)
  createRecord(
    @Body() createRecordDto: CreateRecordDto,
  ): Promise<RecordEntity> {
    this.logger.verbose(
      `Creating new record: ${JSON.stringify(createRecordDto)}`,
    );
    return this.recordsService.createRecord(createRecordDto);
  }

  @Get(':id')
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getRecord(@Param('id') getRecordDto: GetRecordDto): Promise<RecordEntity> {
    return this.recordsService.getRecord(getRecordDto);
  }

  @Get()
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getRecords(
    @Query() getRecordsFilterDto: GetRecordsFilterDto,
  ): Promise<RecordEntity[]> {
    return this.recordsService.getRecords(getRecordsFilterDto);
  }

  @Patch(':id/health-status')
  @ApiOkResponse({ description: 'The resource was updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  updateRecordHealthStatus(
    @Param('id') getRecordDto: GetRecordDto,
    @Body() updateRecordHealthDto: UpdateRecordHealthDto,
  ): Promise<RecordEntity> {
    return this.recordsService.updateRecordHealthStatus(
      getRecordDto,
      updateRecordHealthDto,
    );
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'The resource was updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  updateRecord(
    @Param('id') getRecordDto: GetRecordDto,
    @Body() updateRecordDto: UpdateRecordDto,
  ): Promise<RecordEntity> {
    return this.recordsService.updateRecord(getRecordDto, updateRecordDto);
  }

  @Delete(':id')
  @ApiNoContentResponse({
    description: 'The resource was returned successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @Roles(RoleName.ADMIN)
  @HttpCode(204)
  deleteRecord(@Param('id') deleteRecordDto: DeleteRecordDto): Promise<void> {
    return this.recordsService.deleteRecord(deleteRecordDto);
  }
}
