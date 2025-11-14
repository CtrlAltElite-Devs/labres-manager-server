import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { OTPRepository } from '../../repositories/otp.repository';

@Entity({ repository: () => OTPRepository })
export class OTP {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property()
  @Unique()
  email: string;

  @Property()
  code: string;

  @Property({ nullable: true })
  expiryTime?: Date;
}
