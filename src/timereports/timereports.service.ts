import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { TimeReport } from '../entities/timereport.entity';
import { FindOneOptions } from 'typeorm';
import { CreateTimeReportDto } from './dto/createTimeReport';
import { TimereportsRepository } from './timereports.repository';

@Injectable()
export class TimereportsService {
    constructor(
        private repository: TimereportsRepository
    ){}

    async findReportById(id: number, opts?: FindOneOptions<TimeReport>) {
        const entity = await this.repository.findReport({ ...opts, where: { id } });
        if (!entity) {
            throw new NotFoundException();
        }
        return entity;
    }

    async verifyProjectOwnership(userId: number, projectId: number) {
        const report = await this.findReportById(projectId, {relations: {user: true}});

        if(report.user.id !== userId) {
            throw new ForbiddenException();
        }
    }

    createTimeReport(userId: number, props: CreateTimeReportDto) {
        return this.repository.createReport({
            description: props.description, 
            user: { id: userId }, 
            project: { id: props.projectId }
        });
    }

    async stopTimeReport(id: number) {
        const report = await this.findReportById(id);
        const timeEnd = new Date();

        Object.assign(report, {
            timeEnd,
            duration: (timeEnd.getTime() - report.timeStart.getTime()) / 1000,
        });

        return this.repository.save(report)
    }

    getUsersTimeSheets(userIds: number[] = []) {
        return this.repository.getTimesheets(userIds);
    }
}
