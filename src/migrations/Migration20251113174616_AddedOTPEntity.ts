import { Migration } from '@mikro-orm/migrations';

export class Migration20251113174616_AddedOTPEntity extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "otp" ("id" uuid not null, "code" varchar(255) not null, "email" varchar(255) not null, constraint "otp_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "otp" cascade;`);
  }

}
