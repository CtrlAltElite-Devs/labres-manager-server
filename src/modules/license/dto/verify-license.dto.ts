import { IsNotEmpty, IsString, Matches } from "class-validator";

export class VerifyLicenseDto {
    @IsString()
    licenseKey: string;

    @IsString()
    @IsNotEmpty()
    @Matches(/^[^\s]+$/, {
        message: 'fingerPrint must not be empty, contain spaces, or be only whitespace',
    })
    fingerPrint: string;
}