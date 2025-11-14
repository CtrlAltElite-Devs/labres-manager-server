import { Migration } from '@mikro-orm/migrations';

export class Migration20251114092628_MadeEmailUnique extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop constraint "user_email_unique";`);
  }

}
