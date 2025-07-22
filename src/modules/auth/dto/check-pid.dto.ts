/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty } from "class-validator";

export class CheckPidDto {
    @IsNotEmpty()
    pid: string;
}