/* eslint-disable @typescript-eslint/require-await */
import { Migration } from '@mikro-orm/migrations';

export class Migration20250824140317 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "license" add constraint "license_license_key_unique" unique ("license_key");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "license" drop constraint "license_license_key_unique";`);
  }

}
