import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AuthLoginUserDto } from './auth/dtos/auth-login-user.dto';
import { AuthRefreshTokenDto } from './auth/dtos/auth-refresh-token.dto';
import { CreateRecordDto } from './records/dtos/create-record.dto';
import { DeleteRecordDto } from './records/dtos/delete-record.dto';
import { GetRecordDto } from './records/dtos/get-record.dto';
import { GetRecordsFilterDto } from './records/dtos/get-records-filter.dto';
import { UpdateRecordHealthDto } from './records/dtos/update-record-health.dto';
import { UpdateRecordDto } from './records/dtos/update-record.dto';
import { CreateRoleDto } from './roles/dtos/create-role.dto';
import { DeleteRoleDto } from './roles/dtos/delete-role.dto';
import { GetRoleByNameDto } from './roles/dtos/get-role-by-name.dto';
import { GetRoleDto } from './roles/dtos/get-role.dto';
import { UpdateRoleDto } from './roles/dtos/update-role.dto';
import { TransformInterceptor } from './transform.interceptor';
import { CreateUserDto } from './users/dtos/create-user.dto';
import { DeleteUserDto } from './users/dtos/delete-user.dto';
import { GetUserByNameDto } from './users/dtos/get-user-by-name.dto';
import { GetUserDto } from './users/dtos/get-user.dto';
import { UpdateUserDto } from './users/dtos/update-user.dto';

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
    .setDescription('REST API documentation')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      description: 'Default',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config, option);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  logger.log(`App listening on PORT: ${PORT}`);
}
bootstrap();
