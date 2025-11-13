import { Injectable } from "@nestjs/common";
import { OTP } from "src/entities/security/otp.entity";
import { OTPRepository } from "src/repositories/otp.repository";

@Injectable()
export class EmailService {
    constructor(private readonly otpRepository: OTPRepository){}

    async sendVerificationEmail(email: string){
        const otp = new OTP();
        // todo do not make 1234 hahah
        otp.code = "1234";
        otp.email = email;

        await this.otpRepository.upsert(otp, {
            onConflictFields: ["email"],
            onConflictAction: "merge",
            onConflictExcludeFields: ["id"]
        });

        // todo send email logic here
        return true;
    }
}