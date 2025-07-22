import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AuthenticatedMachineRequest } from "./machine-request";
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
        
        if(!machineId){
            this.logger.log("Machine Id not present");
            throw new UnauthorizedException("Missing Machine Id");
        } 

        const license = await this.licenseService.GetLicenseByFingerPrint(machineId);

        if(license === null) {
            this.logger.log("Missing License");
            throw new UnauthorizedException("Missing License");
        }

        this.logger.log("Verified License");
        request.license = license;
        return true;
    }

}