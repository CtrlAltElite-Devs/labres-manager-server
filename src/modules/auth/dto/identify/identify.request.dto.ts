import { IsDateString, IsNotEmpty } from "class-validator";

export class IdentifyRequestDto {
    
    @IsNotEmpty()
    pid: string;

    @IsDateString()
    dob: Date;

    @IsNotEmpty()
    lastname: string;
}