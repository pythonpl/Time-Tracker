import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseArrayPipe, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TimereportsService } from './timereports.service';
import { CreateTimeReportDto } from './dto/createTimeReport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthData } from '../auth/auth.service';
import { LoginGuard } from '../guards/login.guard';
import { User } from '../decorators/user.decorator';
import { AdminGuard } from '../guards/admin.guard';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('timereports')
export class TimereportsController {

    constructor(private timereportsService: TimereportsService){}

    @Post()
    @UseGuards(LoginGuard)
    @HttpCode(HttpStatus.CREATED)
    startTimeReport(@User() user: AuthData, @Body() createTimereportDto: CreateTimeReportDto) {
        return this.timereportsService.createTimeReport(user.id, createTimereportDto);
    }

    @Patch(':id')
    @UseGuards(LoginGuard)
    @HttpCode(HttpStatus.OK)
    async stopTimeReport(@User() user: AuthData, @Param('id', ParseIntPipe) id: number) {
        await this.timereportsService.verifyProjectOwnership(user.id, id);
        return this.timereportsService.stopTimeReport(id);
    }

    @Get('/myreport')
    @UseGuards(LoginGuard)
    getLoggedInUserReports(@User() user: AuthData)  {
        return this.timereportsService.getUsersTimeSheets([user.id])
    }

    @Get('/reports')
    @UseGuards(LoginGuard, AdminGuard)
    getUserReports(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[])  {
        return this.timereportsService.getUsersTimeSheets(ids)
    }
}
