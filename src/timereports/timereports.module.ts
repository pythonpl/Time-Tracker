import { Module } from '@nestjs/common';
import { TimereportsController } from './timereports.controller';
import { TimereportsService } from './timereports.service';
import { TimeReport } from '../entities/timereport.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimereportsRepository } from './timereports.repository';

@Module({
  imports: [TypeOrmModule.forFeature([TimeReport])],
  controllers: [TimereportsController],
  providers: [TimereportsService, TimereportsRepository]
})
export class TimereportsModule {}
