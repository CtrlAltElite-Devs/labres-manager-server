import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthenticatedMachineRequest } from "../common/machine-request";
import { MACHINE_ID } from "src/utils/constants";
import { LicenseService } from "src/modules/license/license.service";

@Injectable()
export class MachineGuard implements CanActivate {
    private readonly logger = new Logger(MachineGuard.name);

    constructor(
        private readonly licenseService: LicenseService
    ) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<AuthenticatedMachineRequest>();
        const machineId = request.headers[MACHINE_ID] as string | undefined;
        const { method, url } = request;

        if (!machineId) {
            this.logger.warn(`[${method}] ${url} | Missing Machine ID`);
            throw new UnauthorizedException("Missing Machine Id");
        }

        const license = await this.licenseService.GetLicenseByFingerPrint(machineId);

        if (!license) {
            this.logger.warn(`[${method}] ${url} | MachineId=${machineId} | License not found`);
            throw new UnauthorizedException("Missing License");
        }

        if (license.isRevoked) {
            this.logger.error(`[${method}] ${url} | MachineId=${machineId} | License revoked`);
            throw new UnauthorizedException(
                "Your machine license was revoked, Please contact the company"
            );
        }

        this.logger.log(`[${method}] ${url} | MachineId=${machineId} | License verified`);
        request.license = license;
        return true;
    }
}
