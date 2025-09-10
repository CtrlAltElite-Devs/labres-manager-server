/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250827142740_Added_Refresh_Tokens extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "refresh_token" ("id" uuid not null, "userPid" varchar(255) not null, "token_hashed" varchar(255) not null, "device_info" varchar(255) not null, "ip_address" varchar(255) not null, "created_at" timestamptz not null, "expires_at" timestamptz not null, constraint "refresh_token_pkey" primary key ("id"));`);

    this.addSql(`alter table "refresh_token" add constraint "refresh_token_userPid_foreign" foreign key ("userPid") references "user" ("pid") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "refresh_token" cascade;`);
  }

}
