import { IsEmail } from "class-validator";

export class RegisterEmailDto {
    pid: string;

    @IsEmail()
    email: string;
}