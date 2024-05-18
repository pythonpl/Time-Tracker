import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsService } from './projects.service';
import { Project } from '../entities/project.entity';
import { Repository } from 'typeorm';
import { MockType, repositoryMockFactory } from '../mocks';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repoMock: MockType<Repository<Project>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getRepositoryToken(Project), useFactory: repositoryMockFactory }
      ],
      
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repoMock = module.get(getRepositoryToken(Project));
  });

  it('Service and mock should be defined', () => {
    expect(service).toBeDefined();
    expect(repoMock).toBeDefined();
  });

  it('Should create project', async () => {
    const project = await service.createProject({ description: 'Blahblah', title: 'Project 1' })

    expect(project.title).toEqual('Project 1');
    expect(project.description).toEqual('Blahblah');
  });

  it('Should find many projects', async () => {
    repoMock.find.mockReturnValue([{ description: 'Blahblah', title: 'Project 1' }]);
    const projects = await service.findMany({ skip: 0, take: 10, sortType: 'createdAt', sortValue: 'ASC' });

    expect(projects.length).toBe(1);
    expect(projects[0]).toMatchObject({ description: 'Blahblah', title: 'Project 1' });
  });
});
