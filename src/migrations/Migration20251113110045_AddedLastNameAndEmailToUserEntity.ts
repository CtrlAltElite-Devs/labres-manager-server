/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20251113110045_AddedLastNameAndEmailToUserEntity extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "last_name" varchar(255) null, add column "email" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "last_name", drop column "email";`);
  }

}
