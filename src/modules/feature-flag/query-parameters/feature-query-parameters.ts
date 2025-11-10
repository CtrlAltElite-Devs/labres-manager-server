import { QBFilterQuery } from "@mikro-orm/core";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { FeatureFlag } from "src/entities/feature-flag.entity";

export class FeatureQueryResourceParameters {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    featureName?: string

    @ApiProperty({ required: false })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true' || value === true) return true;
        if (value === 'false' || value === false) return false;
        return undefined;
    })
    IsOn?: boolean

    GetFilters(): QBFilterQuery<FeatureFlag> {
        return {
            ...(this.featureName && { featureName: { $ilike: `%${this.featureName}%` } }),
            ...(this.IsOn !== undefined && { isOn: this.IsOn })
        }
    }
}
