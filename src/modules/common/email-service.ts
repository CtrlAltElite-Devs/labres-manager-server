import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OTP } from 'src/entities/security/otp.entity';
import { OTPRepository } from 'src/repositories/otp.repository';
import * as nodemailer from 'nodemailer';
import { IS_STRICTLY_DEV } from 'src/utils/environment';
@Injectable()
export class EmailService {
  constructor(
    private readonly otpRepository: OTPRepository,
    private readonly config: ConfigService,
  ) {}

  private MailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: IS_STRICTLY_DEV ? 587 : 465,
      secure: !IS_STRICTLY_DEV,
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });

    return transporter;
  }

  async sendEmailVerificationV2() {
    const transporter = this.MailTransport();
    const info = await transporter.sendMail({
      from: this.config.get<string>('SMTP_USER'),
      to: 'lorenzolubguban@gmail.com',
      subject: 'Welcome!',
      text: 'Congratulations, ikaw pinaka gwapo sa full scale',
      html: '<b>Congratulations, ikaw pinaka gwapo sa full scale</b>',
    });

    return info;
  }

  async sendVerificationEmail(email: string) {
    const otp = new OTP();
    // todo do not make 1234 hahah
    otp.code = '1234';
    otp.email = email;

    await this.otpRepository.upsert(otp, {
      onConflictFields: ['email'],
      onConflictAction: 'merge',
      onConflictExcludeFields: ['id'],
    });

    // todo send email logic here
    return true;
  }
}
