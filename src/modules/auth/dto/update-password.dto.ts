/* eslint-disable @typescript-eslint/no-unsafe-call */
//todo add password validation

import { IsNotEmpty, IsStrongPassword } from "class-validator";

export class UpdatePasswordDto {
    @IsNotEmpty()
    pid: string;

    @IsStrongPassword({
        minLength: 3,
    })
    password: string;
}