import { Migration } from '@mikro-orm/migrations';

export class Migration20240603120451 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_email1_unique";');
    this.addSql('alter table "user" drop constraint "user_password_unique";');

    this.addSql('alter table "user" rename column "email1" to "email";');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_email_unique";');

    this.addSql('alter table "user" rename column "email" to "email1";');
    this.addSql('alter table "user" add constraint "user_email1_unique" unique ("email1");');
    this.addSql('alter table "user" add constraint "user_password_unique" unique ("password");');
  }

}
