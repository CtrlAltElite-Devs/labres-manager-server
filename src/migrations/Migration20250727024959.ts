import { Migration } from '@mikro-orm/migrations';

export class Migration20250727024959 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "license" add column "is_revoked" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "license" drop column "is_revoked";`);
  }

}
