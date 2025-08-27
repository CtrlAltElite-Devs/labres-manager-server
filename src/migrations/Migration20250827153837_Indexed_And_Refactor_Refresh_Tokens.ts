/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250827153837_Indexed_And_Refactor_Refresh_Tokens extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "refresh_token" add column "browser_name" varchar(255) not null;`);
    this.addSql(`alter table "refresh_token" rename column "device_info" to "os";`);
    this.addSql(`create index "refresh_token_os_index" on "refresh_token" ("os");`);
    this.addSql(`create index "refresh_token_browser_name_index" on "refresh_token" ("browser_name");`);
    this.addSql(`create index "refresh_token_ip_address_index" on "refresh_token" ("ip_address");`);
    this.addSql(`create index "refresh_token_userPid_browser_name_ip_address_os_index" on "refresh_token" ("userPid", "browser_name", "ip_address", "os");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index "refresh_token_os_index";`);
    this.addSql(`drop index "refresh_token_browser_name_index";`);
    this.addSql(`drop index "refresh_token_ip_address_index";`);
    this.addSql(`drop index "refresh_token_userPid_browser_name_ip_address_os_index";`);
    this.addSql(`alter table "refresh_token" drop column "browser_name";`);

    this.addSql(`alter table "refresh_token" rename column "os" to "device_info";`);
  }

}
