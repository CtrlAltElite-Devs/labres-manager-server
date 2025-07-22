/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250722025339 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create type "admin_role" as enum ('admin', 'super_admin');`);
    this.addSql(`alter table "admin" add column "password" varchar(255) not null, add column "role" "admin_role" not null, add column "created_at" timestamptz not null;`);
    this.addSql(`alter table "admin" alter column "id" drop default;`);
    this.addSql(`alter table "admin" alter column "id" type uuid using ("id"::text::uuid);`);
    this.addSql(`alter table "admin" rename column "name" to "email";`);
    this.addSql(`alter table "admin" add constraint "admin_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "admin" alter column "id" type text using ("id"::text);`);

    this.addSql(`alter table "admin" drop constraint "admin_email_unique";`);
    this.addSql(`alter table "admin" drop column "password", drop column "role", drop column "created_at";`);

    this.addSql(`alter table "admin" alter column "id" type varchar(255) using ("id"::varchar(255));`);
    this.addSql(`alter table "admin" rename column "email" to "name";`);

    this.addSql(`drop type "admin_role";`);
  }

}
