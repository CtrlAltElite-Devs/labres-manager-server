import { Migration } from '@mikro-orm/migrations';

export class Migration20250827161044_Added_Admin_RefreshTokens extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_userPid_foreign";`);

    this.addSql(`alter table "refresh_token" add column "adminId" uuid null;`);
    this.addSql(`alter table "refresh_token" alter column "userPid" type varchar(255) using ("userPid"::varchar(255));`);
    this.addSql(`alter table "refresh_token" alter column "userPid" drop not null;`);
    this.addSql(`alter table "refresh_token" add constraint "refresh_token_adminId_foreign" foreign key ("adminId") references "admin" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "refresh_token" add constraint "refresh_token_userPid_foreign" foreign key ("userPid") references "user" ("pid") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_adminId_foreign";`);
    this.addSql(`alter table "refresh_token" drop constraint "refresh_token_userPid_foreign";`);

    this.addSql(`alter table "refresh_token" drop column "adminId";`);

    this.addSql(`alter table "refresh_token" alter column "userPid" type varchar(255) using ("userPid"::varchar(255));`);
    this.addSql(`alter table "refresh_token" alter column "userPid" set not null;`);
    this.addSql(`alter table "refresh_token" add constraint "refresh_token_userPid_foreign" foreign key ("userPid") references "user" ("pid") on update cascade;`);
  }

}
