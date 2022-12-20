import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsController } from './records.controller';
import { Record } from './record.entity';
import { RecordsService } from './records.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RecordsController],
  providers: [RecordsService],
  imports: [TypeOrmModule.forFeature([Record]), AuthModule],
})
export class RecordsModule {}
