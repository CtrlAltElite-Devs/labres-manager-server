import { IsNotEmpty } from "class-validator";

export class CheckPidDto {
    @IsNotEmpty()
    pid: string;
}