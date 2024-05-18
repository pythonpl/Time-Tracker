import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    @IsString()
    @ApiProperty()
    title: string;

    @IsString()
    @ApiProperty()
    description: string;
}