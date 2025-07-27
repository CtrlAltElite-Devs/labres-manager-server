import { IsString, MinLength } from "class-validator";

export class CreateLicenseDto {
    @IsString()
    @MinLength(11)
    licenseKey: string;
}