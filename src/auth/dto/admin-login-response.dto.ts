import { Admin } from "src/entities/admin.entity";

export class AdminLoginResponseDto {
    admin: Admin;
    token: string;
}