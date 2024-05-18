import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsIn, IsNumber, Min } from "class-validator";

const sortType = ['createdAt', 'title'] as const;
const sortValue = ['ASC', 'DESC'] as const;
export type SortType = typeof sortType[number];
export type SortValue = typeof sortValue[number];

export class FindProjectsDto {
    @IsIn(sortType)
    @ApiProperty()
    sortType: SortType;

    @IsIn(sortValue)
    @ApiProperty()
    sortValue: SortValue;

    @IsNumber()
    @Min(0)
    @Transform(({value}) => parseInt(value))
    @ApiProperty()
    skip: number;

    @IsNumber()
    @Min(0)
    @Transform(({value}) => parseInt(value))
    @ApiProperty()
    take: number;
}