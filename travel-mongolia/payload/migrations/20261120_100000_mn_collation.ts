import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Монгол цагаан толгойн эрэмбэ: Neon-ий DB анхдагчаар C.UTF-8 (кодын цэгээр) — «Өндөр», «Үүлэн» жагсаалтын
// төгсгөлд очдог. Contentful (production) болон snapshot-д Ө нь О-гийн, Ү нь У-гийн дараа. `order: 'fields.name'`,
// `'fields.title'` г.м. эрэмбэлдэг *_locales.title / name баганыг ICU root (und) collation-тай болгоно — JS localeCompare-тэй ижил (латин эхэнд, Ө нь О-гийн, Ү нь У-гийн дараа).
// ICU collation байхгүй Postgres-д (зарим локал build) юу ч хийхгүй.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
DO $$
DECLARE r record;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_collation WHERE collname = 'und-x-icu') THEN
    RAISE NOTICE 'und-x-icu collation алга — алгасав';
    RETURN;
  END IF;
  FOR r IN
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = current_schema() AND table_name LIKE '%\\_locales' ESCAPE '\\'
      AND column_name IN ('title', 'name') AND data_type = 'character varying'
  LOOP
    EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE varchar COLLATE "und-x-icu"', r.table_name, r.column_name);
  END LOOP;
END $$;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT table_name, column_name FROM information_schema.columns
    WHERE table_schema = current_schema() AND collation_name = 'und-x-icu'
  LOOP
    EXECUTE format('ALTER TABLE %I ALTER COLUMN %I TYPE varchar COLLATE "default"', r.table_name, r.column_name);
  END LOOP;
END $$;`)
}
