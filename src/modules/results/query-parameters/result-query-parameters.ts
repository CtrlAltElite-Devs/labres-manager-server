import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";

export class ResultQueryResourceParameters {
    @ApiProperty({required : false})
    @IsOptional()
    testName? : string

    @ApiProperty({required : false})
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    testDate? : Date
}