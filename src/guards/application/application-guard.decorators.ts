import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";
import { AuthGuard } from "./auth.guard";
import { RolesGuard } from "./admin-roles.guard";
import { AdminRole } from "src/entities/admin.entity";
import { UserOnlyGuard } from "./user-only.guard";

export const ROLES_KEY = "roles";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export function SuperAdminOnly(){
    return applyDecorators(
        UseGuards(AuthGuard, RolesGuard), Roles(AdminRole.SUPER_ADMIN),
    )
}

export function AdminOnly(){
    return applyDecorators(
        UseGuards(AuthGuard, RolesGuard), Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
    )
}

export function UserOnly(){
    return applyDecorators(
        UseGuards(AuthGuard, UserOnlyGuard)
    )
}

