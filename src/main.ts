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
import { CreateRecordDto } from './common/records/dtos/create-record.dto';
import { DeleteRecordDto } from './common/records/dtos/delete-record.dto';
import { GetRecordDto } from './common/records/dtos/get-record.dto';
import { GetRecordsFilterDto } from './common/records/dtos/get-records-filter.dto';
import { UpdateRecordDto } from './common/records/dtos/update-record.dto';
import { CreateRoleDto } from './common/roles/dtos/create-role.dto';
import { DeleteRoleDto } from './common/roles/dtos/delete-role.dto';
import { GetRoleByNameDto } from './common/roles/dtos/get-role-by-name.dto';
import { GetRoleDto } from './common/roles/dtos/get-role.dto';
import { UpdateRoleDto } from './common/roles/dtos/update-role.dto';
import { TransformInterceptor } from './global/interceptors/transform.interceptor';
import { CreateUserDto } from './common/users/dtos/create-user.dto';
import { DeleteUserDto } from './common/users/dtos/delete-user.dto';
import { GetUserByUsernameDto } from './common/users/dtos/get-user-by-username.dto';
import { GetUserDto } from './common/users/dtos/get-user.dto';
import { UpdateUserDto } from './common/users/dtos/update-user.dto';

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
      GetUserByUsernameDto,
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
