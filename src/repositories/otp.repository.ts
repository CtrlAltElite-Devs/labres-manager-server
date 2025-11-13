import { EntityRepository } from "@mikro-orm/core";
import { OTP } from "src/entities/security/otp.entity";

export class OTPRepository extends EntityRepository<OTP>{

}