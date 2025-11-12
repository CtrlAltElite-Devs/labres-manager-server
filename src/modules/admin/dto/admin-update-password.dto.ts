import { IsStrongPassword } from "class-validator";

export class AdminUpdatePasswordDto {
    oldPassword: string;

    @IsStrongPassword({
        minLength: 6
    })
    newPassword: string;
}