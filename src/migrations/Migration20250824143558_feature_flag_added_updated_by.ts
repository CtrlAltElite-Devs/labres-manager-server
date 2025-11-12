/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250824143558_feature_flag_added_updated_by extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "feature_flag" add column "adminId" uuid null;`);
    this.addSql(`alter table "feature_flag" add constraint "feature_flag_adminId_foreign" foreign key ("adminId") references "admin" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "feature_flag" drop constraint "feature_flag_adminId_foreign";`);

    this.addSql(`alter table "feature_flag" drop column "adminId";`);
  }

}
