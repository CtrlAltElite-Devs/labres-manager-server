import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional } from "class-validator";
import { type QBFilterQuery } from "@mikro-orm/postgresql";
import { TestResult } from "src/entities/test-result.entity";

export class ResultQueryResourceParameters {
  @ApiProperty({ required: false })
  @IsOptional()
  testName?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  testDate?: Date


  GetFilters(): QBFilterQuery<TestResult> {
    return {
      ...(this.testName && { testName: { $ilike: `%${this.testName}%` } }),
      ...(this.testDate && { testDate: this.testDate }),
    };
  }

}
