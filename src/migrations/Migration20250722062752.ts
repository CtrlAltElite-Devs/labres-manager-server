import { Migration } from '@mikro-orm/migrations';

export class Migration20250722062752 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "test_result" drop constraint "test_result_user_pid_foreign";`);

    this.addSql(`alter table "test_result" rename column "user_pid" to "userPid";`);
    this.addSql(`alter table "test_result" add constraint "test_result_userPid_foreign" foreign key ("userPid") references "user" ("pid") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "test_result" drop constraint "test_result_userPid_foreign";`);

    this.addSql(`alter table "test_result" rename column "userPid" to "user_pid";`);
    this.addSql(`alter table "test_result" add constraint "test_result_user_pid_foreign" foreign key ("user_pid") references "user" ("pid") on update cascade;`);
  }

}
