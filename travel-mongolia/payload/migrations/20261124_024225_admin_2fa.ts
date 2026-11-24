import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "totp_attempts" (
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attempts" numeric DEFAULT 0 NOT NULL,
  	"lock_until" timestamp(3) with time zone
  );
  
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'admin';
  ALTER TABLE "users" ADD COLUMN "recovery_codes" jsonb;
  ALTER TABLE "users" ADD COLUMN "totp_secret" varchar;
  -- Одоохондоо бүх хэрэглэгч admin (payload/collections.ts ALL_USERS_ADMIN)
  UPDATE "users" SET "role" = 'admin';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "totp_attempts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "totp_attempts" CASCADE;
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'editor';
  ALTER TABLE "users" DROP COLUMN "recovery_codes";
  ALTER TABLE "users" DROP COLUMN "totp_secret";`)
}
