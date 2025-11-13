import { User } from "src/entities/user.entity";

export enum IdentifyStatus {
    NOT_FOUND = "not_found",
    NEEDS_ONBOARDING = "needs_onboarding",
    NEEDS_EMAIL = "needs_email",
    EMAIL_REGISTERED = "email_registered",
    READY_TO_LOGIN = "ready_to_login"
}

export class IdentifyPayload {
    pid: string;
    email: string;
    emailVerified: boolean;
    hasPassword: boolean;

    static NeedsEmail(pid: string) : IdentifyPayload {
        const payload = new IdentifyPayload();
        payload.pid = pid;
        return payload;
    }

    static NeedsOnboarding(pid: string) : IdentifyPayload {
        const payload = new IdentifyPayload();
        payload.pid = pid;
        return payload;
    }

    static EmailRegistered(user: User) : IdentifyPayload {
        const payload = new IdentifyPayload();
        payload.pid = user.pid;
        payload.email = user.email!;
        payload.emailVerified = user.emailVerified;
        payload.hasPassword = user.password !== null;
        return payload;
    }

    static ReadyForLogin(user: User) : IdentifyPayload {
        const payload = new IdentifyPayload();
        payload.pid = user.pid;
        payload.email = user.email!;
        payload.emailVerified = user.emailVerified;
        payload.hasPassword = user.password !== null;
        return payload;
    }
}

export class IdentifyResponseDto {
    status: IdentifyStatus
    message: string;
    payload? : IdentifyPayload

    static NotFound() : IdentifyResponseDto {
        return {
            status: IdentifyStatus.NOT_FOUND,
            message: "user not found",
        }
    }

    static NeedsOnboarding(pid: string) : IdentifyResponseDto {
        return {
            status: IdentifyStatus.NEEDS_ONBOARDING,
            message: "user is not yet onboarded",
            payload: IdentifyPayload.NeedsOnboarding(pid)
        }
    }

    static NeedsEmail(pid: string) : IdentifyResponseDto {
        return {
            status: IdentifyStatus.NEEDS_EMAIL,
            message: "You need to register your email",
            payload: IdentifyPayload.NeedsEmail(pid)
        }
    }

    static EmailRegistered(user: User) : IdentifyResponseDto {
        return {
            status: IdentifyStatus.EMAIL_REGISTERED,
            message: "User email is registered",
            payload: IdentifyPayload.EmailRegistered(user)
        }
    }

    static ReadyToLogin(user: User) : IdentifyResponseDto {
        return {
            status: IdentifyStatus.READY_TO_LOGIN,
            message: "User can login",
            payload: IdentifyPayload.ReadyForLogin(user)
        }
    }
}
