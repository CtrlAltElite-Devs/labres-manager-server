/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250722034133 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" alter column "dob" type timestamptz using ("dob"::timestamptz);`);
    this.addSql(`alter table "user" alter column "dob" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" alter column "dob" type timestamptz using ("dob"::timestamptz);`);
    this.addSql(`alter table "user" alter column "dob" set not null;`);
  }

}
