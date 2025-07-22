import { AdminRole } from "src/entities/admin.entity";

// todo add validation for roles and password
export class AdminRegisterDto {
    email: string;
    password: string;
    role: AdminRole;
}