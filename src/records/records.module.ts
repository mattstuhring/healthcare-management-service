import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsController } from './records.controller';
import { RecordEntity } from './record.entity';
import { RecordsService } from './records.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RecordsController],
  providers: [RecordsService],
  imports: [TypeOrmModule.forFeature([RecordEntity]), AuthModule],
})
export class RecordsModule {}
