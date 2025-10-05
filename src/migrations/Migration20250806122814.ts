/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250806122814 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "feature_flag" ("id" uuid not null, "feature_name" varchar(255) not null, "description" varchar(255) null, "is_on" boolean not null default true, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "feature_flag_pkey" primary key ("id"));`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_feature_name_unique" unique ("feature_name");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "feature_flag" cascade;`);
  }

}
