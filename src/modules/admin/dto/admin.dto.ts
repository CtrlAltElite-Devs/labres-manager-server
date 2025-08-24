import { AdminRole } from "src/entities/admin.entity";

export class AdminDto {
    id: string;
    email: string;
    role: AdminRole
}