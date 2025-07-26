import { Migration } from '@mikro-orm/migrations';

export class Migration20250726143633 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "test_result" add column "machine_license_id" uuid not null;`);
    this.addSql(`alter table "test_result" add constraint "test_result_machine_license_id_foreign" foreign key ("machine_license_id") references "license" ("license_id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "test_result" drop constraint "test_result_machine_license_id_foreign";`);

    this.addSql(`alter table "test_result" drop column "machine_license_id";`);
  }

}
