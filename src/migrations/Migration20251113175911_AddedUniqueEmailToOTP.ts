import { Migration } from '@mikro-orm/migrations';

export class Migration20251113175911_AddedUniqueEmailToOTP extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "otp" add constraint "otp_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "otp" drop constraint "otp_email_unique";`);
  }

}
