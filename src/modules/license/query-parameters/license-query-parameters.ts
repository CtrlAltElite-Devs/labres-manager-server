import { ApiProperty } from "@nestjs/swagger";
import { QBFilterQuery } from "@mikro-orm/core";
import { IsOptional, IsString } from "class-validator";
import { License } from "src/entities/license.entity";
import { Transform } from "class-transformer";

export class LicenseQueryResourceParameters {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  isRevoked?: boolean

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  licenseKey?: string;


  GetFilters(): QBFilterQuery<License> {
    return {
      ...(this.isRevoked !== undefined && { isRevoked: this.isRevoked }),
      ...(this.licenseKey && { licenseKey: { $ilike: `%${this.licenseKey}%` } })
    };
  }
}
