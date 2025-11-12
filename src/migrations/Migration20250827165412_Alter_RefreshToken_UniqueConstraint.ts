/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250827165412_Alter_RefreshToken_UniqueConstraint extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_userPid_foreign";`);
    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_adminId_foreign";`);

    this.addSql(`drop index "refresh_token_os_index";`);
    this.addSql(`drop index "refresh_token_browser_name_index";`);
    this.addSql(`drop index "refresh_token_ip_address_index";`);
    this.addSql(`drop index "refresh_token_userPid_browser_name_ip_address_os_index";`);
    this.addSql(`alter table "refresh_token" drop column "userPid", drop column "adminId";`);

    this.addSql(`alter table "refresh_token" add column "user_id" varchar(255) not null;`);
    this.addSql(`alter table "refresh_token" add constraint "refresh_token_user_id_browser_name_ip_address_os_unique" unique ("user_id", "browser_name", "ip_address", "os");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_user_id_browser_name_ip_address_os_unique";`);
    this.addSql(`alter table "refresh_token" drop column "user_id";`);

    this.addSql(`alter table "refresh_token" add column "userPid" varchar(255) null, add column "adminId" uuid null;`);
    this.addSql(`alter table "refresh_token" add constraint "refresh_token_userPid_foreign" foreign key ("userPid") references "user" ("pid") on update cascade on delete set null;`);
    this.addSql(`alter table "refresh_token" add constraint "refresh_token_adminId_foreign" foreign key ("adminId") references "admin" ("id") on update cascade on delete set null;`);
    this.addSql(`create index "refresh_token_os_index" on "refresh_token" ("os");`);
    this.addSql(`create index "refresh_token_browser_name_index" on "refresh_token" ("browser_name");`);
    this.addSql(`create index "refresh_token_ip_address_index" on "refresh_token" ("ip_address");`);
    this.addSql(`create index "refresh_token_userPid_browser_name_ip_address_os_index" on "refresh_token" ("userPid", "browser_name", "ip_address", "os");`);
  }

}
