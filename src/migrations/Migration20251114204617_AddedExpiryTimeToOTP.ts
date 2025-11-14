import { Migration } from '@mikro-orm/migrations';

export class Migration20251114204617_AddedExpiryTimeToOTP extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "otp" add column "expiry_time" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "otp" drop column "expiry_time";`);
  }

}
