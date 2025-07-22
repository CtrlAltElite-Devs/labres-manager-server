import { ApiHeaderOptions } from "@nestjs/swagger";
import { Request } from "express";
import { License } from "src/entities/license.entity";
import { MACHINE_ID } from "src/utils/constants";

export interface AuthenticatedMachineRequest extends Request {
    license? : License;
}

export const machineHeaderOptions : ApiHeaderOptions = {
    name: MACHINE_ID,
    description: 'Machine fingerprint',
    required: true,
}
