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
import { CreateRecordDto } from './dtos/create-record.dto';
import { GetRecordDto } from './dtos/get-record.dto';
import { DeleteRecordDto } from './dtos/delete-record.dto';
import { UpdateRecordDto } from './dtos/update-record.dto';
import { GetRecordsFilterDto } from './dtos/get-records-filter.dto';
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
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
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
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  getRecord(@Param() getRecordDto: GetRecordDto): Promise<RecordEntity> {
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

  @Patch(':id')
  @ApiOkResponse({ description: 'The resource was updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthenticated request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Roles(RoleName.ADMIN, RoleName.EMPLOYEE)
  updateRecord(
    @Param() getRecordDto: GetRecordDto,
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
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  @Roles(RoleName.ADMIN)
  @HttpCode(204)
  deleteRecord(@Param() deleteRecordDto: DeleteRecordDto): Promise<void> {
    return this.recordsService.deleteRecord(deleteRecordDto);
  }
}
