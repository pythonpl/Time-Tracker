import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { CreateProjectDto } from './dto/createProjectDto';
import { FindProjectsDto } from './dto/findProjectsDto';
import { ProjectsService } from './projects.service';
import { LoginGuard } from '../guards/login.guard';
import { AdminGuard } from '../guards/admin.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('projects')
@ApiBearerAuth()
@Controller('projects')
export class ProjectsController {

    constructor(private projectsService: ProjectsService){}

    @Post()
    @UseGuards(LoginGuard, AdminGuard)
    @HttpCode(HttpStatus.CREATED)
    createProject(@Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.createProject(createProjectDto);
    }

    @Get()
    @UseGuards(LoginGuard)
    @HttpCode(HttpStatus.OK)
    findProjects(@Query() findProjectDto: FindProjectsDto) {
        return this.projectsService.findMany(findProjectDto);
    }
}
