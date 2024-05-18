import { Test, TestingModule } from '@nestjs/testing';
import { TimereportsService } from './timereports.service';
import { TimereportsRepository } from './timereports.repository';
import { TimeReport } from '../entities/timereport.entity';
import { NotFoundException } from '@nestjs/common';

/**
 * 
 *  {
        id: 1,
        description: 'StartWorking',
        timeStart: new Date('2024-05-17 17:27:08'),
        timeEnd: new Date('2024-05-17 17:29:10'),
        duration: 122,
        project: { id: 1 } as any,
        user: { id: 1 } as any,
        setTimeStart: ()=>{},
      }
 */
describe('TimereportsService', () => {
  let service: TimereportsService;
  let fakeReportsRepo: Partial<TimereportsRepository>;
  let reportId: number;

  beforeAll(async () => {
    const reports: TimeReport[] = [];

    fakeReportsRepo = {
      createReport: (props) => {
        const entity = { id: Math.floor(Math.random() * 999999), timeStart: new Date(), duration: 0, ...props } as TimeReport;
        reports.push(entity);
        return Promise.resolve(entity);
      },
      findReport: (opts) => {
        const id = (opts as any).where.id;
        const report = reports.find(v => v.id === id);
        return Promise.resolve(report);
      },
      getTimesheets: () => {
        return Promise.resolve([{day: new Date(), dayDuration: Math.floor(Math.random() * 999999)}])
      },
      save: (report) => {
        const exists = reports.map(s => s.id).indexOf(report.id);
        if(exists) {
          reports.splice(exists, 1);
        }
        reports.push(report);
        return Promise.resolve(report);
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimereportsService,
        {
          provide: TimereportsRepository,
          useValue: fakeReportsRepo,
        }
    ]}).compile();

    service = module.get<TimereportsService>(TimereportsService);
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should fail to find report', async () => {
    await expect(service.findReportById(1)).rejects.toThrow(NotFoundException);
  })

  it('Should create report', async () => {
    const report = await service.createTimeReport(1, { description: 'Start', projectId: 1 });

    expect(report.id).toBeGreaterThan(0);
    expect(report.project.id).toEqual(1);
    expect(report.user.id).toEqual(1);
    expect(report.duration).toEqual(0);
    reportId = report.id;
  });

  it('Should find report', async () => {
    const report = await service.findReportById(reportId);
    expect(report).toBeDefined();
  });

  it('Should stop time', async () => {
    // To be sure that duration won't be zero
    await new Promise(resolve => setTimeout(resolve, 2000));
    const report = await service.stopTimeReport(reportId);
    expect(report.duration).toBeGreaterThan(0);
  });

  it('Should display sum of the reports', async () => {
    const result = await service.getUsersTimeSheets([]);

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].dayDuration).toBeGreaterThan(0);
  })
});
