/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250722030044 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "test_result" ("id" varchar(255) not null, "user_pid" varchar(255) not null, "test_name" varchar(255) not null, "binary_pdf" bytea not null, "size" int not null, "test_date" timestamp not null, constraint "test_result_pkey" primary key ("id"));`);

    this.addSql(`alter table "test_result" add constraint "test_result_user_pid_foreign" foreign key ("user_pid") references "user" ("pid") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "test_result" cascade;`);
  }

}
