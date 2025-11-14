import { EntityRepository } from '@mikro-orm/core';
import { OTP } from '../entities/security/otp.entity';

export class OTPRepository extends EntityRepository<OTP> {
  async CreateOTP(email: string) {
    const otp = new OTP();
    otp.code = this.generateOTP();
    otp.email = email;
    otp.expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    await this.upsert(otp, {
      onConflictFields: ['email'],
      onConflictAction: 'merge',
      onConflictExcludeFields: ['id'],
    });

    return otp;
  }

  private generateOTP(): string {
    return Math.floor(10000 * Math.random())
      .toString()
      .padStart(4, '0');
  }
}
