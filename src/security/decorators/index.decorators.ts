import { applyDecorators, UseGuards } from "@nestjs/common";
import { RolesGuard } from "../guards/admin-roles.guard";
import { AdminRole } from "src/entities/admin.entity";
import { AuthGuard } from "../guards/auth.guard";
import { UserOnlyGuard } from "../guards/user-only.guard";
import { Roles } from "./admin-roles.decorator";
import { ApiBearerAuth, ApiHeader } from "@nestjs/swagger";
import { ACCESS_TOKEN } from "src/configurations/common-configuration";
import { machineHeaderOptions } from "../common/machine-request";
import { MachineGuard } from "../guards/machine.guard";

export function UseAuthenticationGuard(){
    return applyDecorators(
        UseGuards(AuthGuard),
        ApiBearerAuth(ACCESS_TOKEN)
    )
}

export function UseSuperAdminOnlyGuard(){
    return applyDecorators(
        UseAuthenticationGuard(),
        UseGuards(RolesGuard), 
        Roles(AdminRole.SUPER_ADMIN),
    )
}

export function UseAdminOnlyGuard(){
    return applyDecorators(
        UseAuthenticationGuard(),
        UseGuards(RolesGuard), 
        Roles(AdminRole.ADMIN, AdminRole.SUPER_ADMIN)
    )
}

export function UseUserOnlyGuard(){
    return applyDecorators(
        UseAuthenticationGuard(),
        UseGuards(UserOnlyGuard)
    )
}

export function UseMachineGuard(){
    return applyDecorators(
        UseGuards(MachineGuard),
        ApiHeader(machineHeaderOptions)
    )
}

