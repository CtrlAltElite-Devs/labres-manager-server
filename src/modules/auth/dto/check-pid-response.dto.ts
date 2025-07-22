export class CheckPidResponseDto {
    hasPassword: boolean
    hasPid: boolean;
    pid: string;

    static NotFoundPid(pid: string): CheckPidResponseDto {
        return {
            hasPassword: false,
            hasPid: false,
            pid: pid
        }
    }

    static NoPassword(pid:string): CheckPidResponseDto{
        return {
            hasPassword: false,
            hasPid: true,
            pid: pid
        }
    }

    static HasPidAndPassword(pid: string) : CheckPidResponseDto {
        return {
            hasPassword: true,
            hasPid: true,
            pid: pid
        }
    }
}