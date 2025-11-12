/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250722025618 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "dob" timestamptz not null, add column "created_at" timestamptz not null;`);
    this.addSql(`alter table "user" rename column "name" to "password";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "dob", drop column "created_at";`);

    this.addSql(`alter table "user" rename column "password" to "name";`);
  }

}
