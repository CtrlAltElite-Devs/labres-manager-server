import { IsEmail, IsString } from "class-validator";

export class SendVerificationEmailDto {
    @IsString()
    pid?: string;

    @IsEmail()
    email: string;
}