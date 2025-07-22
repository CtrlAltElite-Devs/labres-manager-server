/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250722024452 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "admin" ("id" varchar(255) not null, "name" varchar(255) not null, constraint "admin_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("pid" varchar(255) not null, "name" varchar(255) not null, constraint "user_pkey" primary key ("pid"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "admin" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

}
