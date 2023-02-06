import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthLoginUserDto } from './auth/dto/auth-login-user.dto';
import { AuthRefreshTokenDto } from './auth/dto/auth-refresh-token.dto';
import { CreateRecordDto } from './records/dto/create-record.dto';
import { DeleteRecordDto } from './records/dto/delete-record.dto';
import { GetRecordDto } from './records/dto/get-record.dto';
import { GetRecordsFilterDto } from './records/dto/get-records-filter.dto';
import { UpdateRecordHealthDto } from './records/dto/update-record-health.dto';
import { UpdateRecordDto } from './records/dto/update-record.dto';
import { CreateRoleDto } from './roles/dto/create-role.dto';
import { DeleteRoleDto } from './roles/dto/delete-role.dto';
import { GetRoleByNameDto } from './roles/dto/get-role-by-name.dto';
import { GetRoleDto } from './roles/dto/get-role.dto';
import { UpdateRoleDto } from './roles/dto/update-role.dto';
import { TransformInterceptor } from './transform.interceptor';
import { CreateUserDto } from './users/dto/create-user.dto';
import { DeleteUserDto } from './users/dto/delete-user.dto';
import { GetUserByNameDto } from './users/dto/get-user-by-name.dto';
import { GetUserDto } from './users/dto/get-user.dto';
import { UpdateUserDto } from './users/dto/update-user.dto';

async function bootstrap() {
  const logger = new Logger();
  const PORT = 3000;

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  const option: SwaggerDocumentOptions = {
    extraModels: [
      CreateUserDto,
      GetUserDto,
      GetUserByNameDto,
      UpdateUserDto,
      DeleteUserDto,
      CreateRoleDto,
      GetRoleByNameDto,
      GetRoleDto,
      DeleteRoleDto,
      UpdateRoleDto,
      CreateRecordDto,
      DeleteRecordDto,
      GetRecordDto,
      GetRecordsFilterDto,
      UpdateRecordHealthDto,
      UpdateRecordDto,
      AuthLoginUserDto,
      AuthRefreshTokenDto,
    ],
  };

  const config = new DocumentBuilder()
    .setTitle('Healthcare Management Service')
    .setDescription('Healthcare management REST API.')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, option);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  logger.log(`App listening on PORT: ${PORT}`);
}
bootstrap();
