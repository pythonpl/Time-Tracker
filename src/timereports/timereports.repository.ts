import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, FindOneOptions, Repository } from "typeorm";
import { TimeReport } from "../entities/timereport.entity";

@Injectable()
export class TimereportsRepository {

    constructor(
        @InjectRepository(TimeReport)
        private repository: Repository<TimeReport>
    ){}

    findReport(opts: FindOneOptions<TimeReport>) {
        return this.repository.findOne(opts);
    }

    save(report: TimeReport) {
        return this.repository.save(report);
    }

    createReport(props: DeepPartial<TimeReport>) {
        const entity = this.repository.create(props);
        return this.save(entity);
    }
    
    getTimesheets(userIds: number[]): Promise<Array<{ day: Date, dayDuration: number }>>{
        const query = this.repository
            .createQueryBuilder('report')
            .select(["SUM(report.duration) AS dayDuration", "DATE(report.timeStart) as day"])
            .groupBy('DATE(report.timeStart)')

        if(userIds.length > 0) {
            query.where("report.userId IN(:...userIds)", { userIds })
        }
            
        return query.getRawMany();
    }

}