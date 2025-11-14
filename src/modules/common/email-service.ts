import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OTPRepository } from 'src/repositories/otp.repository';
import * as nodemailer from 'nodemailer';
import { IS_STRICTLY_DEV } from 'src/utils/environment';
import { render } from '@react-email/render';
import React from 'react';
import VerificationCode from 'emails/verification-code';


@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

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

  private generateEmail = (template: React.JSX.Element) => {
    return render(template);
  };

  async sendVerificationEmail(email: string) {
    try {
      const otp = await this.otpRepository.CreateOTP(email);

      const html = await this.generateEmail(VerificationCode({ otp: otp.code }));

      await this.MailTransport().sendMail({
        from: `"Lab Result Manager" <${this.config.get<string>('SMTP_USER')}>`,
        to: email,
        subject: 'Verification Code',
        html,
      });

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw new InternalServerErrorException('Unable to send verification email. Please try again later.');
    }
  }
}
