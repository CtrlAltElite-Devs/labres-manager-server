import { IsEmail } from "class-validator";

export class VerifyEmailDto {
    pid: string;

    @IsEmail()
    email: string;
    
    code: string;
}