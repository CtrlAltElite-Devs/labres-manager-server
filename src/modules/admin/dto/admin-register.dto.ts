/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsStrongPassword } from "class-validator";

export class AdminRegisterDto {
    @IsEmail()
    email: string;
    
    @IsStrongPassword({
        minLength: 6
    })
    password: string;
}