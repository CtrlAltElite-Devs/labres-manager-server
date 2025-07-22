/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty } from "class-validator";

export class LoginDto {
    pid: string;
    
    @IsNotEmpty()
    password: string;
}