import { Migration } from '@mikro-orm/migrations';

export class Migration20250722144026 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "license" alter column "finger_print" type varchar(255) using ("finger_print"::varchar(255));`);
    this.addSql(`alter table "license" alter column "finger_print" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "license" alter column "finger_print" type varchar(255) using ("finger_print"::varchar(255));`);
    this.addSql(`alter table "license" alter column "finger_print" set not null;`);
  }

}
