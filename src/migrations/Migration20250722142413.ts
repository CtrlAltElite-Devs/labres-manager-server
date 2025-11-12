/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250722142413 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "license" ("license_id" uuid not null, "license_key" varchar(255) not null, "created_at" timestamptz not null, "finger_print" varchar(255) not null, constraint "license_pkey" primary key ("license_id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "license" cascade;`);
  }

}
