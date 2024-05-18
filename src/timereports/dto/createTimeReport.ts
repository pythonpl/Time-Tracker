import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class CreateTimeReportDto {
    @IsString()
    @ApiProperty()
    description: string;

    @IsNumber()
    @Transform(({value}) => parseInt(value))
    @ApiProperty()
    projectId: number;
}