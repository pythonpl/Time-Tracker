import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { FindOptionsOrder, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/createProjectDto';
import { FindProjectsDto } from './dto/findProjectsDto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private repository: Repository<Project>
    ){}

    createProject(props: CreateProjectDto) {
        const entity = this.repository.create({ title: props.title, description: props.description });
        return this.repository.save(entity);
    }

    findMany(props: FindProjectsDto) {
        const order: FindOptionsOrder<Project> = {};

        if(props.sortType === 'title') {
            order.title = props.sortValue;
        }

        if(props.sortType === 'createdAt') {
            order.createdAt = props.sortValue;
        }

        return this.repository.find({ skip: props.skip, take: props.take, order });
    }
}
