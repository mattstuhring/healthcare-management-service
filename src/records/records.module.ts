import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsController } from './controllers/records.controller';
import { RecordEntity } from './entity/record.entity';
import { RecordsService } from './services/records.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [RecordsController],
  providers: [RecordsService],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RecordEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES_IN'),
          },
        };
      },
    }),
  ],
})
export class RecordsModule {}
