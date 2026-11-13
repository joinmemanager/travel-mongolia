import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_community_experience_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_community_experience_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__community_experience_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__community_experience_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__community_experience_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_culture_article_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_culture_article_section" AS ENUM('ethnic-groups', 'people', 'religion', 'traditions');
  CREATE TYPE "public"."enum_culture_article_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__culture_article_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__culture_article_v_version_section" AS ENUM('ethnic-groups', 'people', 'religion', 'traditions');
  CREATE TYPE "public"."enum__culture_article_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__culture_article_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_culture_heritage_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_culture_heritage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__culture_heritage_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__culture_heritage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__culture_heritage_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_destination_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_destination_protected_category" AS ENUM('strictly-protected', 'national-park', 'nature-reserve', 'natural-monument');
  CREATE TYPE "public"."enum_destination_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__destination_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__destination_v_version_protected_category" AS ENUM('strictly-protected', 'national-park', 'nature-reserve', 'natural-monument');
  CREATE TYPE "public"."enum__destination_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__destination_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_event_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_event_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__event_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__event_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__event_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_faq_item_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_faq_item_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faq_item_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__faq_item_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faq_item_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_heritage_category_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_heritage_category_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__heritage_category_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__heritage_category_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__heritage_category_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_heritage_place_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_heritage_place_protected_category" AS ENUM('strictly-protected', 'national-park', 'nature-reserve', 'natural-monument');
  CREATE TYPE "public"."enum_heritage_place_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__heritage_place_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__heritage_place_v_version_protected_category" AS ENUM('strictly-protected', 'national-park', 'nature-reserve', 'natural-monument');
  CREATE TYPE "public"."enum__heritage_place_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__heritage_place_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_history_article_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_history_article_period" AS ENUM('ancient-land', 'hunnu-empires', 'great-mongol', 'mongol-empire', 'xvii-xix-century', 'xx-century', 'modern-mongolia', 'themes');
  CREATE TYPE "public"."enum_history_article_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__history_article_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__history_article_v_version_period" AS ENUM('ancient-land', 'hunnu-empires', 'great-mongol', 'mongol-empire', 'xvii-xix-century', 'xx-century', 'modern-mongolia', 'themes');
  CREATE TYPE "public"."enum__history_article_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__history_article_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_local_product_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_local_product_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__local_product_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__local_product_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__local_product_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_local_provider_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_local_provider_provider_type" AS ENUM('herder-family', 'guide', 'artisan', 'food', 'small-business', 'accommodation', 'tour');
  CREATE TYPE "public"."enum_local_provider_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__local_provider_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__local_provider_v_version_provider_type" AS ENUM('herder-family', 'guide', 'artisan', 'food', 'small-business', 'accommodation', 'tour');
  CREATE TYPE "public"."enum__local_provider_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__local_provider_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_place_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_place_category" AS ENUM('strictly-protected', 'national-park', 'nature-reserve', 'natural-monument', 'museum', 'theatre', 'culture-center', 'sanatorium', 'landscape');
  CREATE TYPE "public"."enum_place_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__place_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__place_v_version_category" AS ENUM('strictly-protected', 'national-park', 'nature-reserve', 'natural-monument', 'museum', 'theatre', 'culture-center', 'sanatorium', 'landscape');
  CREATE TYPE "public"."enum__place_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__place_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_province_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_province_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__province_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__province_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__province_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_recommendation_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_recommendation_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__recommendation_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__recommendation_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__recommendation_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_soum_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_soum_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__soum_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__soum_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__soum_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_species_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_species_group" AS ENUM('mammal', 'bird', 'reptile', 'fish', 'invertebrate', 'plant');
  CREATE TYPE "public"."enum_species_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__species_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__species_v_version_group" AS ENUM('mammal', 'bird', 'reptile', 'fish', 'invertebrate', 'plant');
  CREATE TYPE "public"."enum__species_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__species_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_story_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_story_topic" AS ENUM('culture', 'nature', 'nomadic', 'food', 'people', 'photo-video', 'news', 'international', 'local', 'respect', 'impact');
  CREATE TYPE "public"."enum_story_language" AS ENUM('mn', 'en', 'zh');
  CREATE TYPE "public"."enum_story_source_type" AS ENUM('standard', 'policy', 'research', 'statistics', 'company-report');
  CREATE TYPE "public"."enum_story_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__story_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__story_v_version_topic" AS ENUM('culture', 'nature', 'nomadic', 'food', 'people', 'photo-video', 'news', 'international', 'local', 'respect', 'impact');
  CREATE TYPE "public"."enum__story_v_version_language" AS ENUM('mn', 'en', 'zh');
  CREATE TYPE "public"."enum__story_v_version_source_type" AS ENUM('standard', 'policy', 'research', 'statistics', 'company-report');
  CREATE TYPE "public"."enum__story_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__story_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_visitor_guidance_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_visitor_guidance_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__visitor_guidance_v_version_published_locales" AS ENUM('en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum__visitor_guidance_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__visitor_guidance_v_published_locale" AS ENUM('mn', 'en', 'zh-CN', 'ru', 'ko', 'ja');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'translator');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "community_experience_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_community_experience_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "community_experience" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"host_id" integer,
  	"province" varchar,
  	"booking_url" varchar,
  	"og_image_id" integer,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_community_experience_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "community_experience_locales" (
  	"title" varchar,
  	"community" varchar,
  	"duration" varchar,
  	"group_size" varchar,
  	"what_you_do" jsonb,
  	"cultural_guidance" varchar,
  	"price" varchar,
  	"season" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "community_experience_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_community_experience_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__community_experience_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_community_experience_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_host_id" integer,
  	"version_province" varchar,
  	"version_booking_url" varchar,
  	"version_og_image_id" integer,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__community_experience_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__community_experience_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_community_experience_v_locales" (
  	"version_title" varchar,
  	"version_community" varchar,
  	"version_duration" varchar,
  	"version_group_size" varchar,
  	"version_what_you_do" jsonb,
  	"version_cultural_guidance" varchar,
  	"version_price" varchar,
  	"version_season" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_community_experience_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "culture_article_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_culture_article_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "culture_article" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"section" "enum_culture_article_section",
  	"order" numeric,
  	"image_id" integer,
  	"source_url" varchar,
  	"needs_replacement" boolean,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_culture_article_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "culture_article_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_culture_article_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__culture_article_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_culture_article_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_section" "enum__culture_article_v_version_section",
  	"version_order" numeric,
  	"version_image_id" integer,
  	"version_source_url" varchar,
  	"version_needs_replacement" boolean,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__culture_article_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__culture_article_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_culture_article_v_locales" (
  	"version_title" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "culture_heritage_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_culture_heritage_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "culture_heritage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"order" numeric,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_culture_heritage_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "culture_heritage_locales" (
  	"title" varchar,
  	"subtitle" varchar,
  	"date" varchar,
  	"tag" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_culture_heritage_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__culture_heritage_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_culture_heritage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_order" numeric,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__culture_heritage_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__culture_heritage_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_culture_heritage_v_locales" (
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_date" varchar,
  	"version_tag" varchar,
  	"version_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "destination_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_destination_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "destination" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"map_coordinates_lat" numeric,
  	"map_coordinates_lon" numeric,
  	"cover_image_id" integer,
  	"temperature" varchar,
  	"weather" varchar,
  	"slug" varchar,
  	"province" varchar,
  	"og_image_id" integer,
  	"reviewed_by" varchar,
  	"last_updated" timestamp(3) with time zone,
  	"province_ref_id" integer,
  	"protected_category" "enum_destination_protected_category",
  	"source_url" varchar,
  	"needs_replacement" boolean,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_destination_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "destination_locales" (
  	"title" varchar,
  	"description" jsonb,
  	"subtitle" varchar,
  	"heritage_features" varchar,
  	"local_people" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"intro" varchar,
  	"why_visit" jsonb,
  	"attractions" jsonb,
  	"things_to_do" jsonb,
  	"best_time_to_visit" varchar,
  	"suggested_duration" varchar,
  	"getting_there" jsonb,
  	"where_to_stay" jsonb,
  	"suggested_itineraries" jsonb,
  	"sources" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "destination_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"community_experience_id" integer,
  	"local_provider_id" integer,
  	"local_product_id" integer,
  	"faq_item_id" integer
  );
  
  CREATE TABLE "_destination_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__destination_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_destination_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_map_coordinates_lat" numeric,
  	"version_map_coordinates_lon" numeric,
  	"version_cover_image_id" integer,
  	"version_temperature" varchar,
  	"version_weather" varchar,
  	"version_slug" varchar,
  	"version_province" varchar,
  	"version_og_image_id" integer,
  	"version_reviewed_by" varchar,
  	"version_last_updated" timestamp(3) with time zone,
  	"version_province_ref_id" integer,
  	"version_protected_category" "enum__destination_v_version_protected_category",
  	"version_source_url" varchar,
  	"version_needs_replacement" boolean,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__destination_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__destination_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_destination_v_locales" (
  	"version_title" varchar,
  	"version_description" jsonb,
  	"version_subtitle" varchar,
  	"version_heritage_features" varchar,
  	"version_local_people" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_intro" varchar,
  	"version_why_visit" jsonb,
  	"version_attractions" jsonb,
  	"version_things_to_do" jsonb,
  	"version_best_time_to_visit" varchar,
  	"version_suggested_duration" varchar,
  	"version_getting_there" jsonb,
  	"version_where_to_stay" jsonb,
  	"version_suggested_itineraries" jsonb,
  	"version_sources" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_destination_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"community_experience_id" integer,
  	"local_provider_id" integer,
  	"local_product_id" integer,
  	"faq_item_id" integer
  );
  
  CREATE TABLE "event_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_event_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "event" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"province" varchar,
  	"booking_url" varchar,
  	"og_image_id" integer,
  	"source_url" varchar,
  	"needs_replacement" boolean,
  	"needs_verification" boolean,
  	"date_text" varchar,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_event_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "event_locales" (
  	"title" varchar,
  	"organizer" varchar,
  	"cultural_meaning" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "event_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "event_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"local_provider_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_event_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__event_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_event_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_province" varchar,
  	"version_booking_url" varchar,
  	"version_og_image_id" integer,
  	"version_source_url" varchar,
  	"version_needs_replacement" boolean,
  	"version_needs_verification" boolean,
  	"version_date_text" varchar,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__event_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__event_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_event_v_locales" (
  	"version_title" varchar,
  	"version_organizer" varchar,
  	"version_cultural_meaning" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_event_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_event_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"local_provider_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "faq_item_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_faq_item_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "faq_item" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faq_item_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "faq_item_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_faq_item_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__faq_item_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_faq_item_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faq_item_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__faq_item_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_faq_item_v_locales" (
  	"version_question" varchar,
  	"version_answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "heritage_category_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_heritage_category_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "heritage_category" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"remaining_count" numeric,
  	"og_image_id" integer,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_heritage_category_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "heritage_category_locales" (
  	"title" varchar,
  	"count" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "heritage_category_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"heritage_place_id" integer
  );
  
  CREATE TABLE "_heritage_category_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__heritage_category_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_heritage_category_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_remaining_count" numeric,
  	"version_og_image_id" integer,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__heritage_category_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__heritage_category_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_heritage_category_v_locales" (
  	"version_title" varchar,
  	"version_count" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_heritage_category_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"heritage_place_id" integer
  );
  
  CREATE TABLE "heritage_place_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_heritage_place_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "heritage_place" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"coordinates_lat" numeric,
  	"coordinates_lon" numeric,
  	"slug" varchar,
  	"province" varchar,
  	"og_image_id" integer,
  	"province_ref_id" integer,
  	"protected_category" "enum_heritage_place_protected_category",
  	"source_url" varchar,
  	"needs_replacement" boolean,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_heritage_place_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "heritage_place_locales" (
  	"name" varchar,
  	"region" varchar,
  	"description" jsonb,
  	"heritage_features" varchar,
  	"local_people" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "heritage_place_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"community_experience_id" integer,
  	"local_provider_id" integer,
  	"local_product_id" integer
  );
  
  CREATE TABLE "_heritage_place_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__heritage_place_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_heritage_place_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_coordinates_lat" numeric,
  	"version_coordinates_lon" numeric,
  	"version_slug" varchar,
  	"version_province" varchar,
  	"version_og_image_id" integer,
  	"version_province_ref_id" integer,
  	"version_protected_category" "enum__heritage_place_v_version_protected_category",
  	"version_source_url" varchar,
  	"version_needs_replacement" boolean,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__heritage_place_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__heritage_place_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_heritage_place_v_locales" (
  	"version_name" varchar,
  	"version_region" varchar,
  	"version_description" jsonb,
  	"version_heritage_features" varchar,
  	"version_local_people" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_heritage_place_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"community_experience_id" integer,
  	"local_provider_id" integer,
  	"local_product_id" integer
  );
  
  CREATE TABLE "history_article_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_history_article_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "history_article" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"period" "enum_history_article_period",
  	"order" numeric,
  	"image_id" integer,
  	"source_url" varchar,
  	"needs_replacement" boolean,
  	"reviewed_by" varchar,
  	"last_updated" timestamp(3) with time zone,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_history_article_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "history_article_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_history_article_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__history_article_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_history_article_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_period" "enum__history_article_v_version_period",
  	"version_order" numeric,
  	"version_image_id" integer,
  	"version_source_url" varchar,
  	"version_needs_replacement" boolean,
  	"version_reviewed_by" varchar,
  	"version_last_updated" timestamp(3) with time zone,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__history_article_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__history_article_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_history_article_v_locales" (
  	"version_title" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "local_product_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_local_product_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "local_product" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"producer_id" integer,
  	"og_image_id" integer,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_local_product_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "local_product_locales" (
  	"name" varchar,
  	"origin" varchar,
  	"story" jsonb,
  	"season" varchar,
  	"where_to_buy" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "local_product_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"community_experience_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_local_product_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__local_product_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_local_product_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_producer_id" integer,
  	"version_og_image_id" integer,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__local_product_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__local_product_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_local_product_v_locales" (
  	"version_name" varchar,
  	"version_origin" varchar,
  	"version_story" jsonb,
  	"version_season" varchar,
  	"version_where_to_buy" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_local_product_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"community_experience_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "local_provider_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_local_provider_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "local_provider" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"provider_type" "enum_local_provider_provider_type",
  	"province" varchar,
  	"location_lat" numeric,
  	"location_lon" numeric,
  	"booking_url" varchar,
  	"contact" varchar,
  	"local_owned" boolean,
  	"women_or_youth_led" boolean,
  	"og_image_id" integer,
  	"source_url" varchar,
  	"needs_replacement" boolean,
  	"needs_verification" boolean,
  	"soum" varchar,
  	"location_text" varchar,
  	"joinme_category" varchar,
  	"joinme_id" varchar,
  	"joinme_url" varchar,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_local_provider_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "local_provider_locales" (
  	"name" varchar,
  	"story" jsonb,
  	"price_from" varchar,
  	"community_participation" varchar,
  	"recognized_certification" varchar,
  	"license_if_required" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "local_provider_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "local_provider_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_local_provider_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__local_provider_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_local_provider_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_provider_type" "enum__local_provider_v_version_provider_type",
  	"version_province" varchar,
  	"version_location_lat" numeric,
  	"version_location_lon" numeric,
  	"version_booking_url" varchar,
  	"version_contact" varchar,
  	"version_local_owned" boolean,
  	"version_women_or_youth_led" boolean,
  	"version_og_image_id" integer,
  	"version_source_url" varchar,
  	"version_needs_replacement" boolean,
  	"version_needs_verification" boolean,
  	"version_soum" varchar,
  	"version_location_text" varchar,
  	"version_joinme_category" varchar,
  	"version_joinme_id" varchar,
  	"version_joinme_url" varchar,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__local_provider_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__local_provider_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_local_provider_v_locales" (
  	"version_name" varchar,
  	"version_story" jsonb,
  	"version_price_from" varchar,
  	"version_community_participation" varchar,
  	"version_recognized_certification" varchar,
  	"version_license_if_required" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_local_provider_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_local_provider_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "place_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_place_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "place" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"category" "enum_place_category",
  	"province_id" integer,
  	"soum" varchar,
  	"image_id" integer,
  	"source_url" varchar,
  	"needs_replacement" boolean,
  	"reviewed_by" varchar,
  	"last_updated" timestamp(3) with time zone,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_place_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "place_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_place_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__place_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_place_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_category" "enum__place_v_version_category",
  	"version_province_id" integer,
  	"version_soum" varchar,
  	"version_image_id" integer,
  	"version_source_url" varchar,
  	"version_needs_replacement" boolean,
  	"version_reviewed_by" varchar,
  	"version_last_updated" timestamp(3) with time zone,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__place_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__place_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_place_v_locales" (
  	"version_title" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "province_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_province_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "province" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"image_id" integer,
  	"og_image_id" integer,
  	"reviewed_by" varchar,
  	"last_updated" timestamp(3) with time zone,
  	"source_url" varchar,
  	"needs_replacement" boolean,
  	"emblem_id" integer,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_province_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "province_locales" (
  	"title" varchar,
  	"center" varchar,
  	"population" varchar,
  	"area" varchar,
  	"highlights" varchar,
  	"description2" jsonb,
  	"heritage_features" varchar,
  	"local_people" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"intro" varchar,
  	"why_visit" jsonb,
  	"attractions" jsonb,
  	"things_to_do" jsonb,
  	"best_time_to_visit" varchar,
  	"suggested_duration" varchar,
  	"getting_there" jsonb,
  	"where_to_stay" jsonb,
  	"suggested_itineraries" jsonb,
  	"sources" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "province_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"community_experience_id" integer,
  	"local_provider_id" integer,
  	"local_product_id" integer,
  	"faq_item_id" integer
  );
  
  CREATE TABLE "_province_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__province_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_province_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_image_id" integer,
  	"version_og_image_id" integer,
  	"version_reviewed_by" varchar,
  	"version_last_updated" timestamp(3) with time zone,
  	"version_source_url" varchar,
  	"version_needs_replacement" boolean,
  	"version_emblem_id" integer,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__province_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__province_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_province_v_locales" (
  	"version_title" varchar,
  	"version_center" varchar,
  	"version_population" varchar,
  	"version_area" varchar,
  	"version_highlights" varchar,
  	"version_description2" jsonb,
  	"version_heritage_features" varchar,
  	"version_local_people" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_intro" varchar,
  	"version_why_visit" jsonb,
  	"version_attractions" jsonb,
  	"version_things_to_do" jsonb,
  	"version_best_time_to_visit" varchar,
  	"version_suggested_duration" varchar,
  	"version_getting_there" jsonb,
  	"version_where_to_stay" jsonb,
  	"version_suggested_itineraries" jsonb,
  	"version_sources" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_province_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"community_experience_id" integer,
  	"local_provider_id" integer,
  	"local_product_id" integer,
  	"faq_item_id" integer
  );
  
  CREATE TABLE "recommendation_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_recommendation_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "recommendation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_url" varchar,
  	"is_featured" boolean,
  	"slug" varchar,
  	"og_image_id" integer,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_recommendation_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "recommendation_locales" (
  	"title" varchar,
  	"season" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_recommendation_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__recommendation_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_recommendation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_link_url" varchar,
  	"version_is_featured" boolean,
  	"version_slug" varchar,
  	"version_og_image_id" integer,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__recommendation_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__recommendation_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_recommendation_v_locales" (
  	"version_title" varchar,
  	"version_season" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "soum_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_soum_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "soum" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"province_id" integer,
  	"own_page" boolean,
  	"image_id" integer,
  	"source_url" varchar,
  	"needs_replacement" boolean,
  	"reviewed_by" varchar,
  	"last_updated" timestamp(3) with time zone,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_soum_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "soum_locales" (
  	"title" varchar,
  	"center" varchar,
  	"population" varchar,
  	"area" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_soum_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__soum_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_soum_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_province_id" integer,
  	"version_own_page" boolean,
  	"version_image_id" integer,
  	"version_source_url" varchar,
  	"version_needs_replacement" boolean,
  	"version_reviewed_by" varchar,
  	"version_last_updated" timestamp(3) with time zone,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__soum_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__soum_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_soum_v_locales" (
  	"version_title" varchar,
  	"version_center" varchar,
  	"version_population" varchar,
  	"version_area" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "species_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_species_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "species" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"latin_name" varchar,
  	"group" "enum_species_group",
  	"own_page" boolean,
  	"order" numeric,
  	"image_id" integer,
  	"source_url" varchar,
  	"needs_replacement" boolean,
  	"reviewed_by" varchar,
  	"last_updated" timestamp(3) with time zone,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_species_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "species_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_species_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__species_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_species_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_latin_name" varchar,
  	"version_group" "enum__species_v_version_group",
  	"version_own_page" boolean,
  	"version_order" numeric,
  	"version_image_id" integer,
  	"version_source_url" varchar,
  	"version_needs_replacement" boolean,
  	"version_reviewed_by" varchar,
  	"version_last_updated" timestamp(3) with time zone,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__species_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__species_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_species_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "story_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_story_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "story" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"topic" "enum_story_topic",
  	"video_url" varchar,
  	"consent_obtained" boolean,
  	"language" "enum_story_language",
  	"updated_date" timestamp(3) with time zone,
  	"og_image_id" integer,
  	"source_url" varchar,
  	"needs_replacement" boolean,
  	"published_date" timestamp(3) with time zone,
  	"original_url" varchar,
  	"publisher" varchar,
  	"year" numeric,
  	"source_type" "enum_story_source_type",
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_story_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "story_locales" (
  	"title" varchar,
  	"body" jsonb,
  	"location" varchar,
  	"source" varchar,
  	"storyteller" varchar,
  	"editor" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "story_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"destination_id" integer,
  	"heritage_place_id" integer,
  	"province_id" integer,
  	"community_experience_id" integer,
  	"local_product_id" integer
  );
  
  CREATE TABLE "_story_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__story_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_story_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_topic" "enum__story_v_version_topic",
  	"version_video_url" varchar,
  	"version_consent_obtained" boolean,
  	"version_language" "enum__story_v_version_language",
  	"version_updated_date" timestamp(3) with time zone,
  	"version_og_image_id" integer,
  	"version_source_url" varchar,
  	"version_needs_replacement" boolean,
  	"version_published_date" timestamp(3) with time zone,
  	"version_original_url" varchar,
  	"version_publisher" varchar,
  	"version_year" numeric,
  	"version_source_type" "enum__story_v_version_source_type",
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__story_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__story_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_story_v_locales" (
  	"version_title" varchar,
  	"version_body" jsonb,
  	"version_location" varchar,
  	"version_source" varchar,
  	"version_storyteller" varchar,
  	"version_editor" varchar,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_story_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer,
  	"destination_id" integer,
  	"heritage_place_id" integer,
  	"province_id" integer,
  	"community_experience_id" integer,
  	"local_product_id" integer
  );
  
  CREATE TABLE "visitor_guidance_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_visitor_guidance_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "visitor_guidance" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_first_published_at" timestamp(3) with time zone,
  	"cf_version" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_visitor_guidance_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "visitor_guidance_locales" (
  	"title" varchar,
  	"season" varchar,
  	"source" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "visitor_guidance_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "visitor_guidance_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destination_id" integer,
  	"heritage_place_id" integer,
  	"province_id" integer
  );
  
  CREATE TABLE "_visitor_guidance_v_version_published_locales" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__visitor_guidance_v_version_published_locales",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_visitor_guidance_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_contentful_id" varchar,
  	"version_cf_created_at" timestamp(3) with time zone,
  	"version_cf_first_published_at" timestamp(3) with time zone,
  	"version_cf_version" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__visitor_guidance_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__visitor_guidance_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_visitor_guidance_v_locales" (
  	"version_title" varchar,
  	"version_season" varchar,
  	"version_source" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_visitor_guidance_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar,
  	"locale" "_locales"
  );
  
  CREATE TABLE "_visitor_guidance_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destination_id" integer,
  	"heritage_place_id" integer,
  	"province_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contentful_id" varchar,
  	"cf_created_at" timestamp(3) with time zone,
  	"cf_file_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_w480_url" varchar,
  	"sizes_w480_width" numeric,
  	"sizes_w480_height" numeric,
  	"sizes_w480_mime_type" varchar,
  	"sizes_w480_filesize" numeric,
  	"sizes_w480_filename" varchar,
  	"sizes_w960_url" varchar,
  	"sizes_w960_width" numeric,
  	"sizes_w960_height" numeric,
  	"sizes_w960_mime_type" varchar,
  	"sizes_w960_filesize" numeric,
  	"sizes_w960_filename" varchar,
  	"sizes_w1600_url" varchar,
  	"sizes_w1600_width" numeric,
  	"sizes_w1600_height" numeric,
  	"sizes_w1600_mime_type" varchar,
  	"sizes_w1600_filesize" numeric,
  	"sizes_w1600_filename" varchar,
  	"sizes_w2400_url" varchar,
  	"sizes_w2400_width" numeric,
  	"sizes_w2400_height" numeric,
  	"sizes_w2400_mime_type" varchar,
  	"sizes_w2400_filesize" numeric,
  	"sizes_w2400_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"community_experience_id" integer,
  	"culture_article_id" integer,
  	"culture_heritage_id" integer,
  	"destination_id" integer,
  	"event_id" integer,
  	"faq_item_id" integer,
  	"heritage_category_id" integer,
  	"heritage_place_id" integer,
  	"history_article_id" integer,
  	"local_product_id" integer,
  	"local_provider_id" integer,
  	"place_id" integer,
  	"province_id" integer,
  	"recommendation_id" integer,
  	"soum_id" integer,
  	"species_id" integer,
  	"story_id" integer,
  	"visitor_guidance_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "community_experience_published_locales" ADD CONSTRAINT "community_experience_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "community_experience" ADD CONSTRAINT "community_experience_host_id_local_provider_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."local_provider"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "community_experience" ADD CONSTRAINT "community_experience_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "community_experience_locales" ADD CONSTRAINT "community_experience_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "community_experience_rels" ADD CONSTRAINT "community_experience_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "community_experience_rels" ADD CONSTRAINT "community_experience_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_community_experience_v_version_published_locales" ADD CONSTRAINT "_community_experience_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_community_experience_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_community_experience_v" ADD CONSTRAINT "_community_experience_v_parent_id_community_experience_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."community_experience"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_community_experience_v" ADD CONSTRAINT "_community_experience_v_version_host_id_local_provider_id_fk" FOREIGN KEY ("version_host_id") REFERENCES "public"."local_provider"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_community_experience_v" ADD CONSTRAINT "_community_experience_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_community_experience_v_locales" ADD CONSTRAINT "_community_experience_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_community_experience_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_community_experience_v_rels" ADD CONSTRAINT "_community_experience_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_community_experience_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_community_experience_v_rels" ADD CONSTRAINT "_community_experience_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "culture_article_published_locales" ADD CONSTRAINT "culture_article_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."culture_article"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "culture_article" ADD CONSTRAINT "culture_article_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "culture_article_locales" ADD CONSTRAINT "culture_article_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."culture_article"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_culture_article_v_version_published_locales" ADD CONSTRAINT "_culture_article_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_culture_article_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_culture_article_v" ADD CONSTRAINT "_culture_article_v_parent_id_culture_article_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."culture_article"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_culture_article_v" ADD CONSTRAINT "_culture_article_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_culture_article_v_locales" ADD CONSTRAINT "_culture_article_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_culture_article_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "culture_heritage_published_locales" ADD CONSTRAINT "culture_heritage_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."culture_heritage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "culture_heritage" ADD CONSTRAINT "culture_heritage_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "culture_heritage_locales" ADD CONSTRAINT "culture_heritage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."culture_heritage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_culture_heritage_v_version_published_locales" ADD CONSTRAINT "_culture_heritage_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_culture_heritage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_culture_heritage_v" ADD CONSTRAINT "_culture_heritage_v_parent_id_culture_heritage_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."culture_heritage"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_culture_heritage_v" ADD CONSTRAINT "_culture_heritage_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_culture_heritage_v_locales" ADD CONSTRAINT "_culture_heritage_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_culture_heritage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destination_published_locales" ADD CONSTRAINT "destination_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destination" ADD CONSTRAINT "destination_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destination" ADD CONSTRAINT "destination_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destination" ADD CONSTRAINT "destination_province_ref_id_province_id_fk" FOREIGN KEY ("province_ref_id") REFERENCES "public"."province"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destination_locales" ADD CONSTRAINT "destination_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destination_rels" ADD CONSTRAINT "destination_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destination_rels" ADD CONSTRAINT "destination_rels_community_experience_fk" FOREIGN KEY ("community_experience_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destination_rels" ADD CONSTRAINT "destination_rels_local_provider_fk" FOREIGN KEY ("local_provider_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destination_rels" ADD CONSTRAINT "destination_rels_local_product_fk" FOREIGN KEY ("local_product_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destination_rels" ADD CONSTRAINT "destination_rels_faq_item_fk" FOREIGN KEY ("faq_item_id") REFERENCES "public"."faq_item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destination_v_version_published_locales" ADD CONSTRAINT "_destination_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_destination_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destination_v" ADD CONSTRAINT "_destination_v_parent_id_destination_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destination"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destination_v" ADD CONSTRAINT "_destination_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destination_v" ADD CONSTRAINT "_destination_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destination_v" ADD CONSTRAINT "_destination_v_version_province_ref_id_province_id_fk" FOREIGN KEY ("version_province_ref_id") REFERENCES "public"."province"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destination_v_locales" ADD CONSTRAINT "_destination_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_destination_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destination_v_rels" ADD CONSTRAINT "_destination_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_destination_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destination_v_rels" ADD CONSTRAINT "_destination_v_rels_community_experience_fk" FOREIGN KEY ("community_experience_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destination_v_rels" ADD CONSTRAINT "_destination_v_rels_local_provider_fk" FOREIGN KEY ("local_provider_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destination_v_rels" ADD CONSTRAINT "_destination_v_rels_local_product_fk" FOREIGN KEY ("local_product_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destination_v_rels" ADD CONSTRAINT "_destination_v_rels_faq_item_fk" FOREIGN KEY ("faq_item_id") REFERENCES "public"."faq_item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_published_locales" ADD CONSTRAINT "event_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event" ADD CONSTRAINT "event_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "event_locales" ADD CONSTRAINT "event_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_texts" ADD CONSTRAINT "event_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_rels" ADD CONSTRAINT "event_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_rels" ADD CONSTRAINT "event_rels_local_provider_fk" FOREIGN KEY ("local_provider_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "event_rels" ADD CONSTRAINT "event_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_event_v_version_published_locales" ADD CONSTRAINT "_event_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_event_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_event_v" ADD CONSTRAINT "_event_v_parent_id_event_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."event"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_event_v" ADD CONSTRAINT "_event_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_event_v_locales" ADD CONSTRAINT "_event_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_event_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_event_v_texts" ADD CONSTRAINT "_event_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_event_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_event_v_rels" ADD CONSTRAINT "_event_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_event_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_event_v_rels" ADD CONSTRAINT "_event_v_rels_local_provider_fk" FOREIGN KEY ("local_provider_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_event_v_rels" ADD CONSTRAINT "_event_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_item_published_locales" ADD CONSTRAINT "faq_item_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faq_item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faq_item_locales" ADD CONSTRAINT "faq_item_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."faq_item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faq_item_v_version_published_locales" ADD CONSTRAINT "_faq_item_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_faq_item_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_faq_item_v" ADD CONSTRAINT "_faq_item_v_parent_id_faq_item_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faq_item"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faq_item_v_locales" ADD CONSTRAINT "_faq_item_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_faq_item_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_category_published_locales" ADD CONSTRAINT "heritage_category_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."heritage_category"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_category" ADD CONSTRAINT "heritage_category_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "heritage_category_locales" ADD CONSTRAINT "heritage_category_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."heritage_category"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_category_rels" ADD CONSTRAINT "heritage_category_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."heritage_category"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_category_rels" ADD CONSTRAINT "heritage_category_rels_heritage_place_fk" FOREIGN KEY ("heritage_place_id") REFERENCES "public"."heritage_place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heritage_category_v_version_published_locales" ADD CONSTRAINT "_heritage_category_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_heritage_category_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heritage_category_v" ADD CONSTRAINT "_heritage_category_v_parent_id_heritage_category_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."heritage_category"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_heritage_category_v" ADD CONSTRAINT "_heritage_category_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_heritage_category_v_locales" ADD CONSTRAINT "_heritage_category_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_heritage_category_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heritage_category_v_rels" ADD CONSTRAINT "_heritage_category_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_heritage_category_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heritage_category_v_rels" ADD CONSTRAINT "_heritage_category_v_rels_heritage_place_fk" FOREIGN KEY ("heritage_place_id") REFERENCES "public"."heritage_place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_place_published_locales" ADD CONSTRAINT "heritage_place_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."heritage_place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_place" ADD CONSTRAINT "heritage_place_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "heritage_place" ADD CONSTRAINT "heritage_place_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "heritage_place" ADD CONSTRAINT "heritage_place_province_ref_id_province_id_fk" FOREIGN KEY ("province_ref_id") REFERENCES "public"."province"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "heritage_place_locales" ADD CONSTRAINT "heritage_place_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."heritage_place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_place_rels" ADD CONSTRAINT "heritage_place_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."heritage_place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_place_rels" ADD CONSTRAINT "heritage_place_rels_community_experience_fk" FOREIGN KEY ("community_experience_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_place_rels" ADD CONSTRAINT "heritage_place_rels_local_provider_fk" FOREIGN KEY ("local_provider_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_place_rels" ADD CONSTRAINT "heritage_place_rels_local_product_fk" FOREIGN KEY ("local_product_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heritage_place_v_version_published_locales" ADD CONSTRAINT "_heritage_place_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_heritage_place_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heritage_place_v" ADD CONSTRAINT "_heritage_place_v_parent_id_heritage_place_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."heritage_place"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_heritage_place_v" ADD CONSTRAINT "_heritage_place_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_heritage_place_v" ADD CONSTRAINT "_heritage_place_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_heritage_place_v" ADD CONSTRAINT "_heritage_place_v_version_province_ref_id_province_id_fk" FOREIGN KEY ("version_province_ref_id") REFERENCES "public"."province"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_heritage_place_v_locales" ADD CONSTRAINT "_heritage_place_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_heritage_place_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heritage_place_v_rels" ADD CONSTRAINT "_heritage_place_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_heritage_place_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heritage_place_v_rels" ADD CONSTRAINT "_heritage_place_v_rels_community_experience_fk" FOREIGN KEY ("community_experience_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heritage_place_v_rels" ADD CONSTRAINT "_heritage_place_v_rels_local_provider_fk" FOREIGN KEY ("local_provider_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_heritage_place_v_rels" ADD CONSTRAINT "_heritage_place_v_rels_local_product_fk" FOREIGN KEY ("local_product_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "history_article_published_locales" ADD CONSTRAINT "history_article_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."history_article"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "history_article" ADD CONSTRAINT "history_article_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "history_article_locales" ADD CONSTRAINT "history_article_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."history_article"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_history_article_v_version_published_locales" ADD CONSTRAINT "_history_article_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_history_article_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_history_article_v" ADD CONSTRAINT "_history_article_v_parent_id_history_article_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."history_article"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_history_article_v" ADD CONSTRAINT "_history_article_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_history_article_v_locales" ADD CONSTRAINT "_history_article_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_history_article_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_product_published_locales" ADD CONSTRAINT "local_product_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_product" ADD CONSTRAINT "local_product_producer_id_local_provider_id_fk" FOREIGN KEY ("producer_id") REFERENCES "public"."local_provider"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "local_product" ADD CONSTRAINT "local_product_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "local_product_locales" ADD CONSTRAINT "local_product_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_product_rels" ADD CONSTRAINT "local_product_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_product_rels" ADD CONSTRAINT "local_product_rels_community_experience_fk" FOREIGN KEY ("community_experience_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_product_rels" ADD CONSTRAINT "local_product_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_product_v_version_published_locales" ADD CONSTRAINT "_local_product_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_local_product_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_product_v" ADD CONSTRAINT "_local_product_v_parent_id_local_product_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."local_product"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_local_product_v" ADD CONSTRAINT "_local_product_v_version_producer_id_local_provider_id_fk" FOREIGN KEY ("version_producer_id") REFERENCES "public"."local_provider"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_local_product_v" ADD CONSTRAINT "_local_product_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_local_product_v_locales" ADD CONSTRAINT "_local_product_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_product_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_product_v_rels" ADD CONSTRAINT "_local_product_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_local_product_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_product_v_rels" ADD CONSTRAINT "_local_product_v_rels_community_experience_fk" FOREIGN KEY ("community_experience_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_product_v_rels" ADD CONSTRAINT "_local_product_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_provider_published_locales" ADD CONSTRAINT "local_provider_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_provider" ADD CONSTRAINT "local_provider_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "local_provider_locales" ADD CONSTRAINT "local_provider_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_provider_texts" ADD CONSTRAINT "local_provider_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_provider_rels" ADD CONSTRAINT "local_provider_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "local_provider_rels" ADD CONSTRAINT "local_provider_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_provider_v_version_published_locales" ADD CONSTRAINT "_local_provider_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_local_provider_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_provider_v" ADD CONSTRAINT "_local_provider_v_parent_id_local_provider_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."local_provider"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_local_provider_v" ADD CONSTRAINT "_local_provider_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_local_provider_v_locales" ADD CONSTRAINT "_local_provider_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_local_provider_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_provider_v_texts" ADD CONSTRAINT "_local_provider_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_local_provider_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_provider_v_rels" ADD CONSTRAINT "_local_provider_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_local_provider_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_local_provider_v_rels" ADD CONSTRAINT "_local_provider_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "place_published_locales" ADD CONSTRAINT "place_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "place" ADD CONSTRAINT "place_province_id_province_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."province"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "place" ADD CONSTRAINT "place_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "place_locales" ADD CONSTRAINT "place_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_place_v_version_published_locales" ADD CONSTRAINT "_place_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_place_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_place_v" ADD CONSTRAINT "_place_v_parent_id_place_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."place"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_place_v" ADD CONSTRAINT "_place_v_version_province_id_province_id_fk" FOREIGN KEY ("version_province_id") REFERENCES "public"."province"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_place_v" ADD CONSTRAINT "_place_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_place_v_locales" ADD CONSTRAINT "_place_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_place_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "province_published_locales" ADD CONSTRAINT "province_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."province"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "province" ADD CONSTRAINT "province_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "province" ADD CONSTRAINT "province_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "province" ADD CONSTRAINT "province_emblem_id_media_id_fk" FOREIGN KEY ("emblem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "province_locales" ADD CONSTRAINT "province_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."province"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "province_rels" ADD CONSTRAINT "province_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."province"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "province_rels" ADD CONSTRAINT "province_rels_community_experience_fk" FOREIGN KEY ("community_experience_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "province_rels" ADD CONSTRAINT "province_rels_local_provider_fk" FOREIGN KEY ("local_provider_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "province_rels" ADD CONSTRAINT "province_rels_local_product_fk" FOREIGN KEY ("local_product_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "province_rels" ADD CONSTRAINT "province_rels_faq_item_fk" FOREIGN KEY ("faq_item_id") REFERENCES "public"."faq_item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_province_v_version_published_locales" ADD CONSTRAINT "_province_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_province_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_province_v" ADD CONSTRAINT "_province_v_parent_id_province_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."province"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_province_v" ADD CONSTRAINT "_province_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_province_v" ADD CONSTRAINT "_province_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_province_v" ADD CONSTRAINT "_province_v_version_emblem_id_media_id_fk" FOREIGN KEY ("version_emblem_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_province_v_locales" ADD CONSTRAINT "_province_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_province_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_province_v_rels" ADD CONSTRAINT "_province_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_province_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_province_v_rels" ADD CONSTRAINT "_province_v_rels_community_experience_fk" FOREIGN KEY ("community_experience_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_province_v_rels" ADD CONSTRAINT "_province_v_rels_local_provider_fk" FOREIGN KEY ("local_provider_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_province_v_rels" ADD CONSTRAINT "_province_v_rels_local_product_fk" FOREIGN KEY ("local_product_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_province_v_rels" ADD CONSTRAINT "_province_v_rels_faq_item_fk" FOREIGN KEY ("faq_item_id") REFERENCES "public"."faq_item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recommendation_published_locales" ADD CONSTRAINT "recommendation_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."recommendation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recommendation" ADD CONSTRAINT "recommendation_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recommendation" ADD CONSTRAINT "recommendation_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "recommendation_locales" ADD CONSTRAINT "recommendation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recommendation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_recommendation_v_version_published_locales" ADD CONSTRAINT "_recommendation_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_recommendation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_recommendation_v" ADD CONSTRAINT "_recommendation_v_parent_id_recommendation_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."recommendation"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_recommendation_v" ADD CONSTRAINT "_recommendation_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_recommendation_v" ADD CONSTRAINT "_recommendation_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_recommendation_v_locales" ADD CONSTRAINT "_recommendation_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_recommendation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "soum_published_locales" ADD CONSTRAINT "soum_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."soum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "soum" ADD CONSTRAINT "soum_province_id_province_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."province"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "soum" ADD CONSTRAINT "soum_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "soum_locales" ADD CONSTRAINT "soum_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."soum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_soum_v_version_published_locales" ADD CONSTRAINT "_soum_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_soum_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_soum_v" ADD CONSTRAINT "_soum_v_parent_id_soum_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."soum"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_soum_v" ADD CONSTRAINT "_soum_v_version_province_id_province_id_fk" FOREIGN KEY ("version_province_id") REFERENCES "public"."province"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_soum_v" ADD CONSTRAINT "_soum_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_soum_v_locales" ADD CONSTRAINT "_soum_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_soum_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "species_published_locales" ADD CONSTRAINT "species_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."species"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "species" ADD CONSTRAINT "species_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "species_locales" ADD CONSTRAINT "species_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."species"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_species_v_version_published_locales" ADD CONSTRAINT "_species_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_species_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_species_v" ADD CONSTRAINT "_species_v_parent_id_species_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."species"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_species_v" ADD CONSTRAINT "_species_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_species_v_locales" ADD CONSTRAINT "_species_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_species_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_published_locales" ADD CONSTRAINT "story_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story" ADD CONSTRAINT "story_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "story_locales" ADD CONSTRAINT "story_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_rels" ADD CONSTRAINT "story_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_rels" ADD CONSTRAINT "story_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_rels" ADD CONSTRAINT "story_rels_destination_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_rels" ADD CONSTRAINT "story_rels_heritage_place_fk" FOREIGN KEY ("heritage_place_id") REFERENCES "public"."heritage_place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_rels" ADD CONSTRAINT "story_rels_province_fk" FOREIGN KEY ("province_id") REFERENCES "public"."province"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_rels" ADD CONSTRAINT "story_rels_community_experience_fk" FOREIGN KEY ("community_experience_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "story_rels" ADD CONSTRAINT "story_rels_local_product_fk" FOREIGN KEY ("local_product_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_story_v_version_published_locales" ADD CONSTRAINT "_story_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_story_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_story_v" ADD CONSTRAINT "_story_v_parent_id_story_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."story"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_story_v" ADD CONSTRAINT "_story_v_version_og_image_id_media_id_fk" FOREIGN KEY ("version_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_story_v_locales" ADD CONSTRAINT "_story_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_story_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_story_v_rels" ADD CONSTRAINT "_story_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_story_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_story_v_rels" ADD CONSTRAINT "_story_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_story_v_rels" ADD CONSTRAINT "_story_v_rels_destination_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_story_v_rels" ADD CONSTRAINT "_story_v_rels_heritage_place_fk" FOREIGN KEY ("heritage_place_id") REFERENCES "public"."heritage_place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_story_v_rels" ADD CONSTRAINT "_story_v_rels_province_fk" FOREIGN KEY ("province_id") REFERENCES "public"."province"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_story_v_rels" ADD CONSTRAINT "_story_v_rels_community_experience_fk" FOREIGN KEY ("community_experience_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_story_v_rels" ADD CONSTRAINT "_story_v_rels_local_product_fk" FOREIGN KEY ("local_product_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visitor_guidance_published_locales" ADD CONSTRAINT "visitor_guidance_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."visitor_guidance"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visitor_guidance_locales" ADD CONSTRAINT "visitor_guidance_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."visitor_guidance"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visitor_guidance_texts" ADD CONSTRAINT "visitor_guidance_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."visitor_guidance"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visitor_guidance_rels" ADD CONSTRAINT "visitor_guidance_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."visitor_guidance"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visitor_guidance_rels" ADD CONSTRAINT "visitor_guidance_rels_destination_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visitor_guidance_rels" ADD CONSTRAINT "visitor_guidance_rels_heritage_place_fk" FOREIGN KEY ("heritage_place_id") REFERENCES "public"."heritage_place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visitor_guidance_rels" ADD CONSTRAINT "visitor_guidance_rels_province_fk" FOREIGN KEY ("province_id") REFERENCES "public"."province"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_visitor_guidance_v_version_published_locales" ADD CONSTRAINT "_visitor_guidance_v_version_published_locales_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_visitor_guidance_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_visitor_guidance_v" ADD CONSTRAINT "_visitor_guidance_v_parent_id_visitor_guidance_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."visitor_guidance"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_visitor_guidance_v_locales" ADD CONSTRAINT "_visitor_guidance_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_visitor_guidance_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_visitor_guidance_v_texts" ADD CONSTRAINT "_visitor_guidance_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_visitor_guidance_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_visitor_guidance_v_rels" ADD CONSTRAINT "_visitor_guidance_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_visitor_guidance_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_visitor_guidance_v_rels" ADD CONSTRAINT "_visitor_guidance_v_rels_destination_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_visitor_guidance_v_rels" ADD CONSTRAINT "_visitor_guidance_v_rels_heritage_place_fk" FOREIGN KEY ("heritage_place_id") REFERENCES "public"."heritage_place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_visitor_guidance_v_rels" ADD CONSTRAINT "_visitor_guidance_v_rels_province_fk" FOREIGN KEY ("province_id") REFERENCES "public"."province"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_community_experience_fk" FOREIGN KEY ("community_experience_id") REFERENCES "public"."community_experience"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_culture_article_fk" FOREIGN KEY ("culture_article_id") REFERENCES "public"."culture_article"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_culture_heritage_fk" FOREIGN KEY ("culture_heritage_id") REFERENCES "public"."culture_heritage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destination_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destination"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_event_fk" FOREIGN KEY ("event_id") REFERENCES "public"."event"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_item_fk" FOREIGN KEY ("faq_item_id") REFERENCES "public"."faq_item"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_heritage_category_fk" FOREIGN KEY ("heritage_category_id") REFERENCES "public"."heritage_category"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_heritage_place_fk" FOREIGN KEY ("heritage_place_id") REFERENCES "public"."heritage_place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_history_article_fk" FOREIGN KEY ("history_article_id") REFERENCES "public"."history_article"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_local_product_fk" FOREIGN KEY ("local_product_id") REFERENCES "public"."local_product"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_local_provider_fk" FOREIGN KEY ("local_provider_id") REFERENCES "public"."local_provider"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_place_fk" FOREIGN KEY ("place_id") REFERENCES "public"."place"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_province_fk" FOREIGN KEY ("province_id") REFERENCES "public"."province"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recommendation_fk" FOREIGN KEY ("recommendation_id") REFERENCES "public"."recommendation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_soum_fk" FOREIGN KEY ("soum_id") REFERENCES "public"."soum"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_species_fk" FOREIGN KEY ("species_id") REFERENCES "public"."species"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_story_fk" FOREIGN KEY ("story_id") REFERENCES "public"."story"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_visitor_guidance_fk" FOREIGN KEY ("visitor_guidance_id") REFERENCES "public"."visitor_guidance"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "community_experience_published_locales_order_idx" ON "community_experience_published_locales" USING btree ("order");
  CREATE INDEX "community_experience_published_locales_parent_idx" ON "community_experience_published_locales" USING btree ("parent_id");
  CREATE INDEX "community_experience_published_locales_value_idx" ON "community_experience_published_locales" USING btree ("value");
  CREATE UNIQUE INDEX "community_experience_slug_idx" ON "community_experience" USING btree ("slug");
  CREATE INDEX "community_experience_host_idx" ON "community_experience" USING btree ("host_id");
  CREATE INDEX "community_experience_og_image_idx" ON "community_experience" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "community_experience_contentful_id_idx" ON "community_experience" USING btree ("contentful_id");
  CREATE INDEX "community_experience_cf_created_at_idx" ON "community_experience" USING btree ("cf_created_at");
  CREATE INDEX "community_experience_updated_at_idx" ON "community_experience" USING btree ("updated_at");
  CREATE INDEX "community_experience_created_at_idx" ON "community_experience" USING btree ("created_at");
  CREATE INDEX "community_experience__status_idx" ON "community_experience" USING btree ("_status");
  CREATE UNIQUE INDEX "community_experience_locales_locale_parent_id_unique" ON "community_experience_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "community_experience_locales_parent_id_idx" ON "community_experience_locales" USING btree ("_parent_id");
  CREATE INDEX "community_experience_rels_order_idx" ON "community_experience_rels" USING btree ("order");
  CREATE INDEX "community_experience_rels_parent_idx" ON "community_experience_rels" USING btree ("parent_id");
  CREATE INDEX "community_experience_rels_path_idx" ON "community_experience_rels" USING btree ("path");
  CREATE INDEX "community_experience_rels_media_id_idx" ON "community_experience_rels" USING btree ("media_id");
  CREATE INDEX "_community_experience_v_version_published_locales_order_idx" ON "_community_experience_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_community_experience_v_version_published_locales_parent_idx" ON "_community_experience_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_community_experience_v_version_published_locales_value_idx" ON "_community_experience_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_community_experience_v_parent_idx" ON "_community_experience_v" USING btree ("parent_id");
  CREATE INDEX "_community_experience_v_version_version_slug_idx" ON "_community_experience_v" USING btree ("version_slug");
  CREATE INDEX "_community_experience_v_version_version_host_idx" ON "_community_experience_v" USING btree ("version_host_id");
  CREATE INDEX "_community_experience_v_version_version_og_image_idx" ON "_community_experience_v" USING btree ("version_og_image_id");
  CREATE INDEX "_community_experience_v_version_version_contentful_id_idx" ON "_community_experience_v" USING btree ("version_contentful_id");
  CREATE INDEX "_community_experience_v_version_version_cf_created_at_idx" ON "_community_experience_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_community_experience_v_version_version_updated_at_idx" ON "_community_experience_v" USING btree ("version_updated_at");
  CREATE INDEX "_community_experience_v_version_version_created_at_idx" ON "_community_experience_v" USING btree ("version_created_at");
  CREATE INDEX "_community_experience_v_version_version__status_idx" ON "_community_experience_v" USING btree ("version__status");
  CREATE INDEX "_community_experience_v_created_at_idx" ON "_community_experience_v" USING btree ("created_at");
  CREATE INDEX "_community_experience_v_updated_at_idx" ON "_community_experience_v" USING btree ("updated_at");
  CREATE INDEX "_community_experience_v_snapshot_idx" ON "_community_experience_v" USING btree ("snapshot");
  CREATE INDEX "_community_experience_v_published_locale_idx" ON "_community_experience_v" USING btree ("published_locale");
  CREATE INDEX "_community_experience_v_latest_idx" ON "_community_experience_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_community_experience_v_locales_locale_parent_id_unique" ON "_community_experience_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_community_experience_v_locales_parent_id_idx" ON "_community_experience_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_community_experience_v_rels_order_idx" ON "_community_experience_v_rels" USING btree ("order");
  CREATE INDEX "_community_experience_v_rels_parent_idx" ON "_community_experience_v_rels" USING btree ("parent_id");
  CREATE INDEX "_community_experience_v_rels_path_idx" ON "_community_experience_v_rels" USING btree ("path");
  CREATE INDEX "_community_experience_v_rels_media_id_idx" ON "_community_experience_v_rels" USING btree ("media_id");
  CREATE INDEX "culture_article_published_locales_order_idx" ON "culture_article_published_locales" USING btree ("order");
  CREATE INDEX "culture_article_published_locales_parent_idx" ON "culture_article_published_locales" USING btree ("parent_id");
  CREATE INDEX "culture_article_published_locales_value_idx" ON "culture_article_published_locales" USING btree ("value");
  CREATE INDEX "culture_article_slug_idx" ON "culture_article" USING btree ("slug");
  CREATE INDEX "culture_article_section_idx" ON "culture_article" USING btree ("section");
  CREATE INDEX "culture_article_image_idx" ON "culture_article" USING btree ("image_id");
  CREATE UNIQUE INDEX "culture_article_contentful_id_idx" ON "culture_article" USING btree ("contentful_id");
  CREATE INDEX "culture_article_cf_created_at_idx" ON "culture_article" USING btree ("cf_created_at");
  CREATE INDEX "culture_article_updated_at_idx" ON "culture_article" USING btree ("updated_at");
  CREATE INDEX "culture_article_created_at_idx" ON "culture_article" USING btree ("created_at");
  CREATE INDEX "culture_article__status_idx" ON "culture_article" USING btree ("_status");
  CREATE UNIQUE INDEX "culture_article_locales_locale_parent_id_unique" ON "culture_article_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "culture_article_locales_parent_id_idx" ON "culture_article_locales" USING btree ("_parent_id");
  CREATE INDEX "_culture_article_v_version_published_locales_order_idx" ON "_culture_article_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_culture_article_v_version_published_locales_parent_idx" ON "_culture_article_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_culture_article_v_version_published_locales_value_idx" ON "_culture_article_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_culture_article_v_parent_idx" ON "_culture_article_v" USING btree ("parent_id");
  CREATE INDEX "_culture_article_v_version_version_slug_idx" ON "_culture_article_v" USING btree ("version_slug");
  CREATE INDEX "_culture_article_v_version_version_section_idx" ON "_culture_article_v" USING btree ("version_section");
  CREATE INDEX "_culture_article_v_version_version_image_idx" ON "_culture_article_v" USING btree ("version_image_id");
  CREATE INDEX "_culture_article_v_version_version_contentful_id_idx" ON "_culture_article_v" USING btree ("version_contentful_id");
  CREATE INDEX "_culture_article_v_version_version_cf_created_at_idx" ON "_culture_article_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_culture_article_v_version_version_updated_at_idx" ON "_culture_article_v" USING btree ("version_updated_at");
  CREATE INDEX "_culture_article_v_version_version_created_at_idx" ON "_culture_article_v" USING btree ("version_created_at");
  CREATE INDEX "_culture_article_v_version_version__status_idx" ON "_culture_article_v" USING btree ("version__status");
  CREATE INDEX "_culture_article_v_created_at_idx" ON "_culture_article_v" USING btree ("created_at");
  CREATE INDEX "_culture_article_v_updated_at_idx" ON "_culture_article_v" USING btree ("updated_at");
  CREATE INDEX "_culture_article_v_snapshot_idx" ON "_culture_article_v" USING btree ("snapshot");
  CREATE INDEX "_culture_article_v_published_locale_idx" ON "_culture_article_v" USING btree ("published_locale");
  CREATE INDEX "_culture_article_v_latest_idx" ON "_culture_article_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_culture_article_v_locales_locale_parent_id_unique" ON "_culture_article_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_culture_article_v_locales_parent_id_idx" ON "_culture_article_v_locales" USING btree ("_parent_id");
  CREATE INDEX "culture_heritage_published_locales_order_idx" ON "culture_heritage_published_locales" USING btree ("order");
  CREATE INDEX "culture_heritage_published_locales_parent_idx" ON "culture_heritage_published_locales" USING btree ("parent_id");
  CREATE INDEX "culture_heritage_published_locales_value_idx" ON "culture_heritage_published_locales" USING btree ("value");
  CREATE INDEX "culture_heritage_image_idx" ON "culture_heritage" USING btree ("image_id");
  CREATE UNIQUE INDEX "culture_heritage_contentful_id_idx" ON "culture_heritage" USING btree ("contentful_id");
  CREATE INDEX "culture_heritage_cf_created_at_idx" ON "culture_heritage" USING btree ("cf_created_at");
  CREATE INDEX "culture_heritage_updated_at_idx" ON "culture_heritage" USING btree ("updated_at");
  CREATE INDEX "culture_heritage_created_at_idx" ON "culture_heritage" USING btree ("created_at");
  CREATE INDEX "culture_heritage__status_idx" ON "culture_heritage" USING btree ("_status");
  CREATE UNIQUE INDEX "culture_heritage_locales_locale_parent_id_unique" ON "culture_heritage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "culture_heritage_locales_parent_id_idx" ON "culture_heritage_locales" USING btree ("_parent_id");
  CREATE INDEX "_culture_heritage_v_version_published_locales_order_idx" ON "_culture_heritage_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_culture_heritage_v_version_published_locales_parent_idx" ON "_culture_heritage_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_culture_heritage_v_version_published_locales_value_idx" ON "_culture_heritage_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_culture_heritage_v_parent_idx" ON "_culture_heritage_v" USING btree ("parent_id");
  CREATE INDEX "_culture_heritage_v_version_version_image_idx" ON "_culture_heritage_v" USING btree ("version_image_id");
  CREATE INDEX "_culture_heritage_v_version_version_contentful_id_idx" ON "_culture_heritage_v" USING btree ("version_contentful_id");
  CREATE INDEX "_culture_heritage_v_version_version_cf_created_at_idx" ON "_culture_heritage_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_culture_heritage_v_version_version_updated_at_idx" ON "_culture_heritage_v" USING btree ("version_updated_at");
  CREATE INDEX "_culture_heritage_v_version_version_created_at_idx" ON "_culture_heritage_v" USING btree ("version_created_at");
  CREATE INDEX "_culture_heritage_v_version_version__status_idx" ON "_culture_heritage_v" USING btree ("version__status");
  CREATE INDEX "_culture_heritage_v_created_at_idx" ON "_culture_heritage_v" USING btree ("created_at");
  CREATE INDEX "_culture_heritage_v_updated_at_idx" ON "_culture_heritage_v" USING btree ("updated_at");
  CREATE INDEX "_culture_heritage_v_snapshot_idx" ON "_culture_heritage_v" USING btree ("snapshot");
  CREATE INDEX "_culture_heritage_v_published_locale_idx" ON "_culture_heritage_v" USING btree ("published_locale");
  CREATE INDEX "_culture_heritage_v_latest_idx" ON "_culture_heritage_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_culture_heritage_v_locales_locale_parent_id_unique" ON "_culture_heritage_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_culture_heritage_v_locales_parent_id_idx" ON "_culture_heritage_v_locales" USING btree ("_parent_id");
  CREATE INDEX "destination_published_locales_order_idx" ON "destination_published_locales" USING btree ("order");
  CREATE INDEX "destination_published_locales_parent_idx" ON "destination_published_locales" USING btree ("parent_id");
  CREATE INDEX "destination_published_locales_value_idx" ON "destination_published_locales" USING btree ("value");
  CREATE INDEX "destination_cover_image_idx" ON "destination" USING btree ("cover_image_id");
  CREATE UNIQUE INDEX "destination_slug_idx" ON "destination" USING btree ("slug");
  CREATE INDEX "destination_og_image_idx" ON "destination" USING btree ("og_image_id");
  CREATE INDEX "destination_province_ref_idx" ON "destination" USING btree ("province_ref_id");
  CREATE INDEX "destination_protected_category_idx" ON "destination" USING btree ("protected_category");
  CREATE UNIQUE INDEX "destination_contentful_id_idx" ON "destination" USING btree ("contentful_id");
  CREATE INDEX "destination_cf_created_at_idx" ON "destination" USING btree ("cf_created_at");
  CREATE INDEX "destination_updated_at_idx" ON "destination" USING btree ("updated_at");
  CREATE INDEX "destination_created_at_idx" ON "destination" USING btree ("created_at");
  CREATE INDEX "destination__status_idx" ON "destination" USING btree ("_status");
  CREATE UNIQUE INDEX "destination_locales_locale_parent_id_unique" ON "destination_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "destination_locales_parent_id_idx" ON "destination_locales" USING btree ("_parent_id");
  CREATE INDEX "destination_rels_order_idx" ON "destination_rels" USING btree ("order");
  CREATE INDEX "destination_rels_parent_idx" ON "destination_rels" USING btree ("parent_id");
  CREATE INDEX "destination_rels_path_idx" ON "destination_rels" USING btree ("path");
  CREATE INDEX "destination_rels_community_experience_id_idx" ON "destination_rels" USING btree ("community_experience_id");
  CREATE INDEX "destination_rels_local_provider_id_idx" ON "destination_rels" USING btree ("local_provider_id");
  CREATE INDEX "destination_rels_local_product_id_idx" ON "destination_rels" USING btree ("local_product_id");
  CREATE INDEX "destination_rels_faq_item_id_idx" ON "destination_rels" USING btree ("faq_item_id");
  CREATE INDEX "_destination_v_version_published_locales_order_idx" ON "_destination_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_destination_v_version_published_locales_parent_idx" ON "_destination_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_destination_v_version_published_locales_value_idx" ON "_destination_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_destination_v_parent_idx" ON "_destination_v" USING btree ("parent_id");
  CREATE INDEX "_destination_v_version_version_cover_image_idx" ON "_destination_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_destination_v_version_version_slug_idx" ON "_destination_v" USING btree ("version_slug");
  CREATE INDEX "_destination_v_version_version_og_image_idx" ON "_destination_v" USING btree ("version_og_image_id");
  CREATE INDEX "_destination_v_version_version_province_ref_idx" ON "_destination_v" USING btree ("version_province_ref_id");
  CREATE INDEX "_destination_v_version_version_protected_category_idx" ON "_destination_v" USING btree ("version_protected_category");
  CREATE INDEX "_destination_v_version_version_contentful_id_idx" ON "_destination_v" USING btree ("version_contentful_id");
  CREATE INDEX "_destination_v_version_version_cf_created_at_idx" ON "_destination_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_destination_v_version_version_updated_at_idx" ON "_destination_v" USING btree ("version_updated_at");
  CREATE INDEX "_destination_v_version_version_created_at_idx" ON "_destination_v" USING btree ("version_created_at");
  CREATE INDEX "_destination_v_version_version__status_idx" ON "_destination_v" USING btree ("version__status");
  CREATE INDEX "_destination_v_created_at_idx" ON "_destination_v" USING btree ("created_at");
  CREATE INDEX "_destination_v_updated_at_idx" ON "_destination_v" USING btree ("updated_at");
  CREATE INDEX "_destination_v_snapshot_idx" ON "_destination_v" USING btree ("snapshot");
  CREATE INDEX "_destination_v_published_locale_idx" ON "_destination_v" USING btree ("published_locale");
  CREATE INDEX "_destination_v_latest_idx" ON "_destination_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_destination_v_locales_locale_parent_id_unique" ON "_destination_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_destination_v_locales_parent_id_idx" ON "_destination_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_destination_v_rels_order_idx" ON "_destination_v_rels" USING btree ("order");
  CREATE INDEX "_destination_v_rels_parent_idx" ON "_destination_v_rels" USING btree ("parent_id");
  CREATE INDEX "_destination_v_rels_path_idx" ON "_destination_v_rels" USING btree ("path");
  CREATE INDEX "_destination_v_rels_community_experience_id_idx" ON "_destination_v_rels" USING btree ("community_experience_id");
  CREATE INDEX "_destination_v_rels_local_provider_id_idx" ON "_destination_v_rels" USING btree ("local_provider_id");
  CREATE INDEX "_destination_v_rels_local_product_id_idx" ON "_destination_v_rels" USING btree ("local_product_id");
  CREATE INDEX "_destination_v_rels_faq_item_id_idx" ON "_destination_v_rels" USING btree ("faq_item_id");
  CREATE INDEX "event_published_locales_order_idx" ON "event_published_locales" USING btree ("order");
  CREATE INDEX "event_published_locales_parent_idx" ON "event_published_locales" USING btree ("parent_id");
  CREATE INDEX "event_published_locales_value_idx" ON "event_published_locales" USING btree ("value");
  CREATE UNIQUE INDEX "event_slug_idx" ON "event" USING btree ("slug");
  CREATE INDEX "event_og_image_idx" ON "event" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "event_contentful_id_idx" ON "event" USING btree ("contentful_id");
  CREATE INDEX "event_cf_created_at_idx" ON "event" USING btree ("cf_created_at");
  CREATE INDEX "event_updated_at_idx" ON "event" USING btree ("updated_at");
  CREATE INDEX "event_created_at_idx" ON "event" USING btree ("created_at");
  CREATE INDEX "event__status_idx" ON "event" USING btree ("_status");
  CREATE UNIQUE INDEX "event_locales_locale_parent_id_unique" ON "event_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "event_locales_parent_id_idx" ON "event_locales" USING btree ("_parent_id");
  CREATE INDEX "event_texts_order_parent" ON "event_texts" USING btree ("order","parent_id");
  CREATE INDEX "event_texts_locale_parent" ON "event_texts" USING btree ("locale","parent_id");
  CREATE INDEX "event_rels_order_idx" ON "event_rels" USING btree ("order");
  CREATE INDEX "event_rels_parent_idx" ON "event_rels" USING btree ("parent_id");
  CREATE INDEX "event_rels_path_idx" ON "event_rels" USING btree ("path");
  CREATE INDEX "event_rels_local_provider_id_idx" ON "event_rels" USING btree ("local_provider_id");
  CREATE INDEX "event_rels_media_id_idx" ON "event_rels" USING btree ("media_id");
  CREATE INDEX "_event_v_version_published_locales_order_idx" ON "_event_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_event_v_version_published_locales_parent_idx" ON "_event_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_event_v_version_published_locales_value_idx" ON "_event_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_event_v_parent_idx" ON "_event_v" USING btree ("parent_id");
  CREATE INDEX "_event_v_version_version_slug_idx" ON "_event_v" USING btree ("version_slug");
  CREATE INDEX "_event_v_version_version_og_image_idx" ON "_event_v" USING btree ("version_og_image_id");
  CREATE INDEX "_event_v_version_version_contentful_id_idx" ON "_event_v" USING btree ("version_contentful_id");
  CREATE INDEX "_event_v_version_version_cf_created_at_idx" ON "_event_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_event_v_version_version_updated_at_idx" ON "_event_v" USING btree ("version_updated_at");
  CREATE INDEX "_event_v_version_version_created_at_idx" ON "_event_v" USING btree ("version_created_at");
  CREATE INDEX "_event_v_version_version__status_idx" ON "_event_v" USING btree ("version__status");
  CREATE INDEX "_event_v_created_at_idx" ON "_event_v" USING btree ("created_at");
  CREATE INDEX "_event_v_updated_at_idx" ON "_event_v" USING btree ("updated_at");
  CREATE INDEX "_event_v_snapshot_idx" ON "_event_v" USING btree ("snapshot");
  CREATE INDEX "_event_v_published_locale_idx" ON "_event_v" USING btree ("published_locale");
  CREATE INDEX "_event_v_latest_idx" ON "_event_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_event_v_locales_locale_parent_id_unique" ON "_event_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_event_v_locales_parent_id_idx" ON "_event_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_event_v_texts_order_parent" ON "_event_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_event_v_texts_locale_parent" ON "_event_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_event_v_rels_order_idx" ON "_event_v_rels" USING btree ("order");
  CREATE INDEX "_event_v_rels_parent_idx" ON "_event_v_rels" USING btree ("parent_id");
  CREATE INDEX "_event_v_rels_path_idx" ON "_event_v_rels" USING btree ("path");
  CREATE INDEX "_event_v_rels_local_provider_id_idx" ON "_event_v_rels" USING btree ("local_provider_id");
  CREATE INDEX "_event_v_rels_media_id_idx" ON "_event_v_rels" USING btree ("media_id");
  CREATE INDEX "faq_item_published_locales_order_idx" ON "faq_item_published_locales" USING btree ("order");
  CREATE INDEX "faq_item_published_locales_parent_idx" ON "faq_item_published_locales" USING btree ("parent_id");
  CREATE INDEX "faq_item_published_locales_value_idx" ON "faq_item_published_locales" USING btree ("value");
  CREATE UNIQUE INDEX "faq_item_contentful_id_idx" ON "faq_item" USING btree ("contentful_id");
  CREATE INDEX "faq_item_cf_created_at_idx" ON "faq_item" USING btree ("cf_created_at");
  CREATE INDEX "faq_item_updated_at_idx" ON "faq_item" USING btree ("updated_at");
  CREATE INDEX "faq_item_created_at_idx" ON "faq_item" USING btree ("created_at");
  CREATE INDEX "faq_item__status_idx" ON "faq_item" USING btree ("_status");
  CREATE UNIQUE INDEX "faq_item_locales_locale_parent_id_unique" ON "faq_item_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "faq_item_locales_parent_id_idx" ON "faq_item_locales" USING btree ("_parent_id");
  CREATE INDEX "_faq_item_v_version_published_locales_order_idx" ON "_faq_item_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_faq_item_v_version_published_locales_parent_idx" ON "_faq_item_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_faq_item_v_version_published_locales_value_idx" ON "_faq_item_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_faq_item_v_parent_idx" ON "_faq_item_v" USING btree ("parent_id");
  CREATE INDEX "_faq_item_v_version_version_contentful_id_idx" ON "_faq_item_v" USING btree ("version_contentful_id");
  CREATE INDEX "_faq_item_v_version_version_cf_created_at_idx" ON "_faq_item_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_faq_item_v_version_version_updated_at_idx" ON "_faq_item_v" USING btree ("version_updated_at");
  CREATE INDEX "_faq_item_v_version_version_created_at_idx" ON "_faq_item_v" USING btree ("version_created_at");
  CREATE INDEX "_faq_item_v_version_version__status_idx" ON "_faq_item_v" USING btree ("version__status");
  CREATE INDEX "_faq_item_v_created_at_idx" ON "_faq_item_v" USING btree ("created_at");
  CREATE INDEX "_faq_item_v_updated_at_idx" ON "_faq_item_v" USING btree ("updated_at");
  CREATE INDEX "_faq_item_v_snapshot_idx" ON "_faq_item_v" USING btree ("snapshot");
  CREATE INDEX "_faq_item_v_published_locale_idx" ON "_faq_item_v" USING btree ("published_locale");
  CREATE INDEX "_faq_item_v_latest_idx" ON "_faq_item_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_faq_item_v_locales_locale_parent_id_unique" ON "_faq_item_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_faq_item_v_locales_parent_id_idx" ON "_faq_item_v_locales" USING btree ("_parent_id");
  CREATE INDEX "heritage_category_published_locales_order_idx" ON "heritage_category_published_locales" USING btree ("order");
  CREATE INDEX "heritage_category_published_locales_parent_idx" ON "heritage_category_published_locales" USING btree ("parent_id");
  CREATE INDEX "heritage_category_published_locales_value_idx" ON "heritage_category_published_locales" USING btree ("value");
  CREATE INDEX "heritage_category_slug_idx" ON "heritage_category" USING btree ("slug");
  CREATE INDEX "heritage_category_og_image_idx" ON "heritage_category" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "heritage_category_contentful_id_idx" ON "heritage_category" USING btree ("contentful_id");
  CREATE INDEX "heritage_category_cf_created_at_idx" ON "heritage_category" USING btree ("cf_created_at");
  CREATE INDEX "heritage_category_updated_at_idx" ON "heritage_category" USING btree ("updated_at");
  CREATE INDEX "heritage_category_created_at_idx" ON "heritage_category" USING btree ("created_at");
  CREATE INDEX "heritage_category__status_idx" ON "heritage_category" USING btree ("_status");
  CREATE UNIQUE INDEX "heritage_category_locales_locale_parent_id_unique" ON "heritage_category_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "heritage_category_locales_parent_id_idx" ON "heritage_category_locales" USING btree ("_parent_id");
  CREATE INDEX "heritage_category_rels_order_idx" ON "heritage_category_rels" USING btree ("order");
  CREATE INDEX "heritage_category_rels_parent_idx" ON "heritage_category_rels" USING btree ("parent_id");
  CREATE INDEX "heritage_category_rels_path_idx" ON "heritage_category_rels" USING btree ("path");
  CREATE INDEX "heritage_category_rels_heritage_place_id_idx" ON "heritage_category_rels" USING btree ("heritage_place_id");
  CREATE INDEX "_heritage_category_v_version_published_locales_order_idx" ON "_heritage_category_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_heritage_category_v_version_published_locales_parent_idx" ON "_heritage_category_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_heritage_category_v_version_published_locales_value_idx" ON "_heritage_category_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_heritage_category_v_parent_idx" ON "_heritage_category_v" USING btree ("parent_id");
  CREATE INDEX "_heritage_category_v_version_version_slug_idx" ON "_heritage_category_v" USING btree ("version_slug");
  CREATE INDEX "_heritage_category_v_version_version_og_image_idx" ON "_heritage_category_v" USING btree ("version_og_image_id");
  CREATE INDEX "_heritage_category_v_version_version_contentful_id_idx" ON "_heritage_category_v" USING btree ("version_contentful_id");
  CREATE INDEX "_heritage_category_v_version_version_cf_created_at_idx" ON "_heritage_category_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_heritage_category_v_version_version_updated_at_idx" ON "_heritage_category_v" USING btree ("version_updated_at");
  CREATE INDEX "_heritage_category_v_version_version_created_at_idx" ON "_heritage_category_v" USING btree ("version_created_at");
  CREATE INDEX "_heritage_category_v_version_version__status_idx" ON "_heritage_category_v" USING btree ("version__status");
  CREATE INDEX "_heritage_category_v_created_at_idx" ON "_heritage_category_v" USING btree ("created_at");
  CREATE INDEX "_heritage_category_v_updated_at_idx" ON "_heritage_category_v" USING btree ("updated_at");
  CREATE INDEX "_heritage_category_v_snapshot_idx" ON "_heritage_category_v" USING btree ("snapshot");
  CREATE INDEX "_heritage_category_v_published_locale_idx" ON "_heritage_category_v" USING btree ("published_locale");
  CREATE INDEX "_heritage_category_v_latest_idx" ON "_heritage_category_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_heritage_category_v_locales_locale_parent_id_unique" ON "_heritage_category_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_heritage_category_v_locales_parent_id_idx" ON "_heritage_category_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_heritage_category_v_rels_order_idx" ON "_heritage_category_v_rels" USING btree ("order");
  CREATE INDEX "_heritage_category_v_rels_parent_idx" ON "_heritage_category_v_rels" USING btree ("parent_id");
  CREATE INDEX "_heritage_category_v_rels_path_idx" ON "_heritage_category_v_rels" USING btree ("path");
  CREATE INDEX "_heritage_category_v_rels_heritage_place_id_idx" ON "_heritage_category_v_rels" USING btree ("heritage_place_id");
  CREATE INDEX "heritage_place_published_locales_order_idx" ON "heritage_place_published_locales" USING btree ("order");
  CREATE INDEX "heritage_place_published_locales_parent_idx" ON "heritage_place_published_locales" USING btree ("parent_id");
  CREATE INDEX "heritage_place_published_locales_value_idx" ON "heritage_place_published_locales" USING btree ("value");
  CREATE INDEX "heritage_place_image_idx" ON "heritage_place" USING btree ("image_id");
  CREATE UNIQUE INDEX "heritage_place_slug_idx" ON "heritage_place" USING btree ("slug");
  CREATE INDEX "heritage_place_og_image_idx" ON "heritage_place" USING btree ("og_image_id");
  CREATE INDEX "heritage_place_province_ref_idx" ON "heritage_place" USING btree ("province_ref_id");
  CREATE INDEX "heritage_place_protected_category_idx" ON "heritage_place" USING btree ("protected_category");
  CREATE UNIQUE INDEX "heritage_place_contentful_id_idx" ON "heritage_place" USING btree ("contentful_id");
  CREATE INDEX "heritage_place_cf_created_at_idx" ON "heritage_place" USING btree ("cf_created_at");
  CREATE INDEX "heritage_place_updated_at_idx" ON "heritage_place" USING btree ("updated_at");
  CREATE INDEX "heritage_place_created_at_idx" ON "heritage_place" USING btree ("created_at");
  CREATE INDEX "heritage_place__status_idx" ON "heritage_place" USING btree ("_status");
  CREATE UNIQUE INDEX "heritage_place_locales_locale_parent_id_unique" ON "heritage_place_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "heritage_place_locales_parent_id_idx" ON "heritage_place_locales" USING btree ("_parent_id");
  CREATE INDEX "heritage_place_rels_order_idx" ON "heritage_place_rels" USING btree ("order");
  CREATE INDEX "heritage_place_rels_parent_idx" ON "heritage_place_rels" USING btree ("parent_id");
  CREATE INDEX "heritage_place_rels_path_idx" ON "heritage_place_rels" USING btree ("path");
  CREATE INDEX "heritage_place_rels_community_experience_id_idx" ON "heritage_place_rels" USING btree ("community_experience_id");
  CREATE INDEX "heritage_place_rels_local_provider_id_idx" ON "heritage_place_rels" USING btree ("local_provider_id");
  CREATE INDEX "heritage_place_rels_local_product_id_idx" ON "heritage_place_rels" USING btree ("local_product_id");
  CREATE INDEX "_heritage_place_v_version_published_locales_order_idx" ON "_heritage_place_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_heritage_place_v_version_published_locales_parent_idx" ON "_heritage_place_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_heritage_place_v_version_published_locales_value_idx" ON "_heritage_place_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_heritage_place_v_parent_idx" ON "_heritage_place_v" USING btree ("parent_id");
  CREATE INDEX "_heritage_place_v_version_version_image_idx" ON "_heritage_place_v" USING btree ("version_image_id");
  CREATE INDEX "_heritage_place_v_version_version_slug_idx" ON "_heritage_place_v" USING btree ("version_slug");
  CREATE INDEX "_heritage_place_v_version_version_og_image_idx" ON "_heritage_place_v" USING btree ("version_og_image_id");
  CREATE INDEX "_heritage_place_v_version_version_province_ref_idx" ON "_heritage_place_v" USING btree ("version_province_ref_id");
  CREATE INDEX "_heritage_place_v_version_version_protected_category_idx" ON "_heritage_place_v" USING btree ("version_protected_category");
  CREATE INDEX "_heritage_place_v_version_version_contentful_id_idx" ON "_heritage_place_v" USING btree ("version_contentful_id");
  CREATE INDEX "_heritage_place_v_version_version_cf_created_at_idx" ON "_heritage_place_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_heritage_place_v_version_version_updated_at_idx" ON "_heritage_place_v" USING btree ("version_updated_at");
  CREATE INDEX "_heritage_place_v_version_version_created_at_idx" ON "_heritage_place_v" USING btree ("version_created_at");
  CREATE INDEX "_heritage_place_v_version_version__status_idx" ON "_heritage_place_v" USING btree ("version__status");
  CREATE INDEX "_heritage_place_v_created_at_idx" ON "_heritage_place_v" USING btree ("created_at");
  CREATE INDEX "_heritage_place_v_updated_at_idx" ON "_heritage_place_v" USING btree ("updated_at");
  CREATE INDEX "_heritage_place_v_snapshot_idx" ON "_heritage_place_v" USING btree ("snapshot");
  CREATE INDEX "_heritage_place_v_published_locale_idx" ON "_heritage_place_v" USING btree ("published_locale");
  CREATE INDEX "_heritage_place_v_latest_idx" ON "_heritage_place_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_heritage_place_v_locales_locale_parent_id_unique" ON "_heritage_place_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_heritage_place_v_locales_parent_id_idx" ON "_heritage_place_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_heritage_place_v_rels_order_idx" ON "_heritage_place_v_rels" USING btree ("order");
  CREATE INDEX "_heritage_place_v_rels_parent_idx" ON "_heritage_place_v_rels" USING btree ("parent_id");
  CREATE INDEX "_heritage_place_v_rels_path_idx" ON "_heritage_place_v_rels" USING btree ("path");
  CREATE INDEX "_heritage_place_v_rels_community_experience_id_idx" ON "_heritage_place_v_rels" USING btree ("community_experience_id");
  CREATE INDEX "_heritage_place_v_rels_local_provider_id_idx" ON "_heritage_place_v_rels" USING btree ("local_provider_id");
  CREATE INDEX "_heritage_place_v_rels_local_product_id_idx" ON "_heritage_place_v_rels" USING btree ("local_product_id");
  CREATE INDEX "history_article_published_locales_order_idx" ON "history_article_published_locales" USING btree ("order");
  CREATE INDEX "history_article_published_locales_parent_idx" ON "history_article_published_locales" USING btree ("parent_id");
  CREATE INDEX "history_article_published_locales_value_idx" ON "history_article_published_locales" USING btree ("value");
  CREATE UNIQUE INDEX "history_article_slug_idx" ON "history_article" USING btree ("slug");
  CREATE INDEX "history_article_period_idx" ON "history_article" USING btree ("period");
  CREATE INDEX "history_article_image_idx" ON "history_article" USING btree ("image_id");
  CREATE UNIQUE INDEX "history_article_contentful_id_idx" ON "history_article" USING btree ("contentful_id");
  CREATE INDEX "history_article_cf_created_at_idx" ON "history_article" USING btree ("cf_created_at");
  CREATE INDEX "history_article_updated_at_idx" ON "history_article" USING btree ("updated_at");
  CREATE INDEX "history_article_created_at_idx" ON "history_article" USING btree ("created_at");
  CREATE INDEX "history_article__status_idx" ON "history_article" USING btree ("_status");
  CREATE UNIQUE INDEX "history_article_locales_locale_parent_id_unique" ON "history_article_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "history_article_locales_parent_id_idx" ON "history_article_locales" USING btree ("_parent_id");
  CREATE INDEX "_history_article_v_version_published_locales_order_idx" ON "_history_article_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_history_article_v_version_published_locales_parent_idx" ON "_history_article_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_history_article_v_version_published_locales_value_idx" ON "_history_article_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_history_article_v_parent_idx" ON "_history_article_v" USING btree ("parent_id");
  CREATE INDEX "_history_article_v_version_version_slug_idx" ON "_history_article_v" USING btree ("version_slug");
  CREATE INDEX "_history_article_v_version_version_period_idx" ON "_history_article_v" USING btree ("version_period");
  CREATE INDEX "_history_article_v_version_version_image_idx" ON "_history_article_v" USING btree ("version_image_id");
  CREATE INDEX "_history_article_v_version_version_contentful_id_idx" ON "_history_article_v" USING btree ("version_contentful_id");
  CREATE INDEX "_history_article_v_version_version_cf_created_at_idx" ON "_history_article_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_history_article_v_version_version_updated_at_idx" ON "_history_article_v" USING btree ("version_updated_at");
  CREATE INDEX "_history_article_v_version_version_created_at_idx" ON "_history_article_v" USING btree ("version_created_at");
  CREATE INDEX "_history_article_v_version_version__status_idx" ON "_history_article_v" USING btree ("version__status");
  CREATE INDEX "_history_article_v_created_at_idx" ON "_history_article_v" USING btree ("created_at");
  CREATE INDEX "_history_article_v_updated_at_idx" ON "_history_article_v" USING btree ("updated_at");
  CREATE INDEX "_history_article_v_snapshot_idx" ON "_history_article_v" USING btree ("snapshot");
  CREATE INDEX "_history_article_v_published_locale_idx" ON "_history_article_v" USING btree ("published_locale");
  CREATE INDEX "_history_article_v_latest_idx" ON "_history_article_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_history_article_v_locales_locale_parent_id_unique" ON "_history_article_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_history_article_v_locales_parent_id_idx" ON "_history_article_v_locales" USING btree ("_parent_id");
  CREATE INDEX "local_product_published_locales_order_idx" ON "local_product_published_locales" USING btree ("order");
  CREATE INDEX "local_product_published_locales_parent_idx" ON "local_product_published_locales" USING btree ("parent_id");
  CREATE INDEX "local_product_published_locales_value_idx" ON "local_product_published_locales" USING btree ("value");
  CREATE UNIQUE INDEX "local_product_slug_idx" ON "local_product" USING btree ("slug");
  CREATE INDEX "local_product_producer_idx" ON "local_product" USING btree ("producer_id");
  CREATE INDEX "local_product_og_image_idx" ON "local_product" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "local_product_contentful_id_idx" ON "local_product" USING btree ("contentful_id");
  CREATE INDEX "local_product_cf_created_at_idx" ON "local_product" USING btree ("cf_created_at");
  CREATE INDEX "local_product_updated_at_idx" ON "local_product" USING btree ("updated_at");
  CREATE INDEX "local_product_created_at_idx" ON "local_product" USING btree ("created_at");
  CREATE INDEX "local_product__status_idx" ON "local_product" USING btree ("_status");
  CREATE UNIQUE INDEX "local_product_locales_locale_parent_id_unique" ON "local_product_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "local_product_locales_parent_id_idx" ON "local_product_locales" USING btree ("_parent_id");
  CREATE INDEX "local_product_rels_order_idx" ON "local_product_rels" USING btree ("order");
  CREATE INDEX "local_product_rels_parent_idx" ON "local_product_rels" USING btree ("parent_id");
  CREATE INDEX "local_product_rels_path_idx" ON "local_product_rels" USING btree ("path");
  CREATE INDEX "local_product_rels_community_experience_id_idx" ON "local_product_rels" USING btree ("community_experience_id");
  CREATE INDEX "local_product_rels_media_id_idx" ON "local_product_rels" USING btree ("media_id");
  CREATE INDEX "_local_product_v_version_published_locales_order_idx" ON "_local_product_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_local_product_v_version_published_locales_parent_idx" ON "_local_product_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_local_product_v_version_published_locales_value_idx" ON "_local_product_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_local_product_v_parent_idx" ON "_local_product_v" USING btree ("parent_id");
  CREATE INDEX "_local_product_v_version_version_slug_idx" ON "_local_product_v" USING btree ("version_slug");
  CREATE INDEX "_local_product_v_version_version_producer_idx" ON "_local_product_v" USING btree ("version_producer_id");
  CREATE INDEX "_local_product_v_version_version_og_image_idx" ON "_local_product_v" USING btree ("version_og_image_id");
  CREATE INDEX "_local_product_v_version_version_contentful_id_idx" ON "_local_product_v" USING btree ("version_contentful_id");
  CREATE INDEX "_local_product_v_version_version_cf_created_at_idx" ON "_local_product_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_local_product_v_version_version_updated_at_idx" ON "_local_product_v" USING btree ("version_updated_at");
  CREATE INDEX "_local_product_v_version_version_created_at_idx" ON "_local_product_v" USING btree ("version_created_at");
  CREATE INDEX "_local_product_v_version_version__status_idx" ON "_local_product_v" USING btree ("version__status");
  CREATE INDEX "_local_product_v_created_at_idx" ON "_local_product_v" USING btree ("created_at");
  CREATE INDEX "_local_product_v_updated_at_idx" ON "_local_product_v" USING btree ("updated_at");
  CREATE INDEX "_local_product_v_snapshot_idx" ON "_local_product_v" USING btree ("snapshot");
  CREATE INDEX "_local_product_v_published_locale_idx" ON "_local_product_v" USING btree ("published_locale");
  CREATE INDEX "_local_product_v_latest_idx" ON "_local_product_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_local_product_v_locales_locale_parent_id_unique" ON "_local_product_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_local_product_v_locales_parent_id_idx" ON "_local_product_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_local_product_v_rels_order_idx" ON "_local_product_v_rels" USING btree ("order");
  CREATE INDEX "_local_product_v_rels_parent_idx" ON "_local_product_v_rels" USING btree ("parent_id");
  CREATE INDEX "_local_product_v_rels_path_idx" ON "_local_product_v_rels" USING btree ("path");
  CREATE INDEX "_local_product_v_rels_community_experience_id_idx" ON "_local_product_v_rels" USING btree ("community_experience_id");
  CREATE INDEX "_local_product_v_rels_media_id_idx" ON "_local_product_v_rels" USING btree ("media_id");
  CREATE INDEX "local_provider_published_locales_order_idx" ON "local_provider_published_locales" USING btree ("order");
  CREATE INDEX "local_provider_published_locales_parent_idx" ON "local_provider_published_locales" USING btree ("parent_id");
  CREATE INDEX "local_provider_published_locales_value_idx" ON "local_provider_published_locales" USING btree ("value");
  CREATE UNIQUE INDEX "local_provider_slug_idx" ON "local_provider" USING btree ("slug");
  CREATE INDEX "local_provider_provider_type_idx" ON "local_provider" USING btree ("provider_type");
  CREATE INDEX "local_provider_og_image_idx" ON "local_provider" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "local_provider_contentful_id_idx" ON "local_provider" USING btree ("contentful_id");
  CREATE INDEX "local_provider_cf_created_at_idx" ON "local_provider" USING btree ("cf_created_at");
  CREATE INDEX "local_provider_updated_at_idx" ON "local_provider" USING btree ("updated_at");
  CREATE INDEX "local_provider_created_at_idx" ON "local_provider" USING btree ("created_at");
  CREATE INDEX "local_provider__status_idx" ON "local_provider" USING btree ("_status");
  CREATE UNIQUE INDEX "local_provider_locales_locale_parent_id_unique" ON "local_provider_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "local_provider_locales_parent_id_idx" ON "local_provider_locales" USING btree ("_parent_id");
  CREATE INDEX "local_provider_texts_order_parent" ON "local_provider_texts" USING btree ("order","parent_id");
  CREATE INDEX "local_provider_texts_locale_parent" ON "local_provider_texts" USING btree ("locale","parent_id");
  CREATE INDEX "local_provider_rels_order_idx" ON "local_provider_rels" USING btree ("order");
  CREATE INDEX "local_provider_rels_parent_idx" ON "local_provider_rels" USING btree ("parent_id");
  CREATE INDEX "local_provider_rels_path_idx" ON "local_provider_rels" USING btree ("path");
  CREATE INDEX "local_provider_rels_media_id_idx" ON "local_provider_rels" USING btree ("media_id");
  CREATE INDEX "_local_provider_v_version_published_locales_order_idx" ON "_local_provider_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_local_provider_v_version_published_locales_parent_idx" ON "_local_provider_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_local_provider_v_version_published_locales_value_idx" ON "_local_provider_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_local_provider_v_parent_idx" ON "_local_provider_v" USING btree ("parent_id");
  CREATE INDEX "_local_provider_v_version_version_slug_idx" ON "_local_provider_v" USING btree ("version_slug");
  CREATE INDEX "_local_provider_v_version_version_provider_type_idx" ON "_local_provider_v" USING btree ("version_provider_type");
  CREATE INDEX "_local_provider_v_version_version_og_image_idx" ON "_local_provider_v" USING btree ("version_og_image_id");
  CREATE INDEX "_local_provider_v_version_version_contentful_id_idx" ON "_local_provider_v" USING btree ("version_contentful_id");
  CREATE INDEX "_local_provider_v_version_version_cf_created_at_idx" ON "_local_provider_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_local_provider_v_version_version_updated_at_idx" ON "_local_provider_v" USING btree ("version_updated_at");
  CREATE INDEX "_local_provider_v_version_version_created_at_idx" ON "_local_provider_v" USING btree ("version_created_at");
  CREATE INDEX "_local_provider_v_version_version__status_idx" ON "_local_provider_v" USING btree ("version__status");
  CREATE INDEX "_local_provider_v_created_at_idx" ON "_local_provider_v" USING btree ("created_at");
  CREATE INDEX "_local_provider_v_updated_at_idx" ON "_local_provider_v" USING btree ("updated_at");
  CREATE INDEX "_local_provider_v_snapshot_idx" ON "_local_provider_v" USING btree ("snapshot");
  CREATE INDEX "_local_provider_v_published_locale_idx" ON "_local_provider_v" USING btree ("published_locale");
  CREATE INDEX "_local_provider_v_latest_idx" ON "_local_provider_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_local_provider_v_locales_locale_parent_id_unique" ON "_local_provider_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_local_provider_v_locales_parent_id_idx" ON "_local_provider_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_local_provider_v_texts_order_parent" ON "_local_provider_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_local_provider_v_texts_locale_parent" ON "_local_provider_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_local_provider_v_rels_order_idx" ON "_local_provider_v_rels" USING btree ("order");
  CREATE INDEX "_local_provider_v_rels_parent_idx" ON "_local_provider_v_rels" USING btree ("parent_id");
  CREATE INDEX "_local_provider_v_rels_path_idx" ON "_local_provider_v_rels" USING btree ("path");
  CREATE INDEX "_local_provider_v_rels_media_id_idx" ON "_local_provider_v_rels" USING btree ("media_id");
  CREATE INDEX "place_published_locales_order_idx" ON "place_published_locales" USING btree ("order");
  CREATE INDEX "place_published_locales_parent_idx" ON "place_published_locales" USING btree ("parent_id");
  CREATE INDEX "place_published_locales_value_idx" ON "place_published_locales" USING btree ("value");
  CREATE UNIQUE INDEX "place_slug_idx" ON "place" USING btree ("slug");
  CREATE INDEX "place_category_idx" ON "place" USING btree ("category");
  CREATE INDEX "place_province_idx" ON "place" USING btree ("province_id");
  CREATE INDEX "place_image_idx" ON "place" USING btree ("image_id");
  CREATE UNIQUE INDEX "place_contentful_id_idx" ON "place" USING btree ("contentful_id");
  CREATE INDEX "place_cf_created_at_idx" ON "place" USING btree ("cf_created_at");
  CREATE INDEX "place_updated_at_idx" ON "place" USING btree ("updated_at");
  CREATE INDEX "place_created_at_idx" ON "place" USING btree ("created_at");
  CREATE INDEX "place__status_idx" ON "place" USING btree ("_status");
  CREATE UNIQUE INDEX "place_locales_locale_parent_id_unique" ON "place_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "place_locales_parent_id_idx" ON "place_locales" USING btree ("_parent_id");
  CREATE INDEX "_place_v_version_published_locales_order_idx" ON "_place_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_place_v_version_published_locales_parent_idx" ON "_place_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_place_v_version_published_locales_value_idx" ON "_place_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_place_v_parent_idx" ON "_place_v" USING btree ("parent_id");
  CREATE INDEX "_place_v_version_version_slug_idx" ON "_place_v" USING btree ("version_slug");
  CREATE INDEX "_place_v_version_version_category_idx" ON "_place_v" USING btree ("version_category");
  CREATE INDEX "_place_v_version_version_province_idx" ON "_place_v" USING btree ("version_province_id");
  CREATE INDEX "_place_v_version_version_image_idx" ON "_place_v" USING btree ("version_image_id");
  CREATE INDEX "_place_v_version_version_contentful_id_idx" ON "_place_v" USING btree ("version_contentful_id");
  CREATE INDEX "_place_v_version_version_cf_created_at_idx" ON "_place_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_place_v_version_version_updated_at_idx" ON "_place_v" USING btree ("version_updated_at");
  CREATE INDEX "_place_v_version_version_created_at_idx" ON "_place_v" USING btree ("version_created_at");
  CREATE INDEX "_place_v_version_version__status_idx" ON "_place_v" USING btree ("version__status");
  CREATE INDEX "_place_v_created_at_idx" ON "_place_v" USING btree ("created_at");
  CREATE INDEX "_place_v_updated_at_idx" ON "_place_v" USING btree ("updated_at");
  CREATE INDEX "_place_v_snapshot_idx" ON "_place_v" USING btree ("snapshot");
  CREATE INDEX "_place_v_published_locale_idx" ON "_place_v" USING btree ("published_locale");
  CREATE INDEX "_place_v_latest_idx" ON "_place_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_place_v_locales_locale_parent_id_unique" ON "_place_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_place_v_locales_parent_id_idx" ON "_place_v_locales" USING btree ("_parent_id");
  CREATE INDEX "province_published_locales_order_idx" ON "province_published_locales" USING btree ("order");
  CREATE INDEX "province_published_locales_parent_idx" ON "province_published_locales" USING btree ("parent_id");
  CREATE INDEX "province_published_locales_value_idx" ON "province_published_locales" USING btree ("value");
  CREATE INDEX "province_slug_idx" ON "province" USING btree ("slug");
  CREATE INDEX "province_image_idx" ON "province" USING btree ("image_id");
  CREATE INDEX "province_og_image_idx" ON "province" USING btree ("og_image_id");
  CREATE INDEX "province_emblem_idx" ON "province" USING btree ("emblem_id");
  CREATE UNIQUE INDEX "province_contentful_id_idx" ON "province" USING btree ("contentful_id");
  CREATE INDEX "province_cf_created_at_idx" ON "province" USING btree ("cf_created_at");
  CREATE INDEX "province_updated_at_idx" ON "province" USING btree ("updated_at");
  CREATE INDEX "province_created_at_idx" ON "province" USING btree ("created_at");
  CREATE INDEX "province__status_idx" ON "province" USING btree ("_status");
  CREATE UNIQUE INDEX "province_locales_locale_parent_id_unique" ON "province_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "province_locales_parent_id_idx" ON "province_locales" USING btree ("_parent_id");
  CREATE INDEX "province_rels_order_idx" ON "province_rels" USING btree ("order");
  CREATE INDEX "province_rels_parent_idx" ON "province_rels" USING btree ("parent_id");
  CREATE INDEX "province_rels_path_idx" ON "province_rels" USING btree ("path");
  CREATE INDEX "province_rels_community_experience_id_idx" ON "province_rels" USING btree ("community_experience_id");
  CREATE INDEX "province_rels_local_provider_id_idx" ON "province_rels" USING btree ("local_provider_id");
  CREATE INDEX "province_rels_local_product_id_idx" ON "province_rels" USING btree ("local_product_id");
  CREATE INDEX "province_rels_faq_item_id_idx" ON "province_rels" USING btree ("faq_item_id");
  CREATE INDEX "_province_v_version_published_locales_order_idx" ON "_province_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_province_v_version_published_locales_parent_idx" ON "_province_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_province_v_version_published_locales_value_idx" ON "_province_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_province_v_parent_idx" ON "_province_v" USING btree ("parent_id");
  CREATE INDEX "_province_v_version_version_slug_idx" ON "_province_v" USING btree ("version_slug");
  CREATE INDEX "_province_v_version_version_image_idx" ON "_province_v" USING btree ("version_image_id");
  CREATE INDEX "_province_v_version_version_og_image_idx" ON "_province_v" USING btree ("version_og_image_id");
  CREATE INDEX "_province_v_version_version_emblem_idx" ON "_province_v" USING btree ("version_emblem_id");
  CREATE INDEX "_province_v_version_version_contentful_id_idx" ON "_province_v" USING btree ("version_contentful_id");
  CREATE INDEX "_province_v_version_version_cf_created_at_idx" ON "_province_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_province_v_version_version_updated_at_idx" ON "_province_v" USING btree ("version_updated_at");
  CREATE INDEX "_province_v_version_version_created_at_idx" ON "_province_v" USING btree ("version_created_at");
  CREATE INDEX "_province_v_version_version__status_idx" ON "_province_v" USING btree ("version__status");
  CREATE INDEX "_province_v_created_at_idx" ON "_province_v" USING btree ("created_at");
  CREATE INDEX "_province_v_updated_at_idx" ON "_province_v" USING btree ("updated_at");
  CREATE INDEX "_province_v_snapshot_idx" ON "_province_v" USING btree ("snapshot");
  CREATE INDEX "_province_v_published_locale_idx" ON "_province_v" USING btree ("published_locale");
  CREATE INDEX "_province_v_latest_idx" ON "_province_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_province_v_locales_locale_parent_id_unique" ON "_province_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_province_v_locales_parent_id_idx" ON "_province_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_province_v_rels_order_idx" ON "_province_v_rels" USING btree ("order");
  CREATE INDEX "_province_v_rels_parent_idx" ON "_province_v_rels" USING btree ("parent_id");
  CREATE INDEX "_province_v_rels_path_idx" ON "_province_v_rels" USING btree ("path");
  CREATE INDEX "_province_v_rels_community_experience_id_idx" ON "_province_v_rels" USING btree ("community_experience_id");
  CREATE INDEX "_province_v_rels_local_provider_id_idx" ON "_province_v_rels" USING btree ("local_provider_id");
  CREATE INDEX "_province_v_rels_local_product_id_idx" ON "_province_v_rels" USING btree ("local_product_id");
  CREATE INDEX "_province_v_rels_faq_item_id_idx" ON "_province_v_rels" USING btree ("faq_item_id");
  CREATE INDEX "recommendation_published_locales_order_idx" ON "recommendation_published_locales" USING btree ("order");
  CREATE INDEX "recommendation_published_locales_parent_idx" ON "recommendation_published_locales" USING btree ("parent_id");
  CREATE INDEX "recommendation_published_locales_value_idx" ON "recommendation_published_locales" USING btree ("value");
  CREATE INDEX "recommendation_image_idx" ON "recommendation" USING btree ("image_id");
  CREATE UNIQUE INDEX "recommendation_slug_idx" ON "recommendation" USING btree ("slug");
  CREATE INDEX "recommendation_og_image_idx" ON "recommendation" USING btree ("og_image_id");
  CREATE UNIQUE INDEX "recommendation_contentful_id_idx" ON "recommendation" USING btree ("contentful_id");
  CREATE INDEX "recommendation_cf_created_at_idx" ON "recommendation" USING btree ("cf_created_at");
  CREATE INDEX "recommendation_updated_at_idx" ON "recommendation" USING btree ("updated_at");
  CREATE INDEX "recommendation_created_at_idx" ON "recommendation" USING btree ("created_at");
  CREATE INDEX "recommendation__status_idx" ON "recommendation" USING btree ("_status");
  CREATE UNIQUE INDEX "recommendation_locales_locale_parent_id_unique" ON "recommendation_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "recommendation_locales_parent_id_idx" ON "recommendation_locales" USING btree ("_parent_id");
  CREATE INDEX "_recommendation_v_version_published_locales_order_idx" ON "_recommendation_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_recommendation_v_version_published_locales_parent_idx" ON "_recommendation_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_recommendation_v_version_published_locales_value_idx" ON "_recommendation_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_recommendation_v_parent_idx" ON "_recommendation_v" USING btree ("parent_id");
  CREATE INDEX "_recommendation_v_version_version_image_idx" ON "_recommendation_v" USING btree ("version_image_id");
  CREATE INDEX "_recommendation_v_version_version_slug_idx" ON "_recommendation_v" USING btree ("version_slug");
  CREATE INDEX "_recommendation_v_version_version_og_image_idx" ON "_recommendation_v" USING btree ("version_og_image_id");
  CREATE INDEX "_recommendation_v_version_version_contentful_id_idx" ON "_recommendation_v" USING btree ("version_contentful_id");
  CREATE INDEX "_recommendation_v_version_version_cf_created_at_idx" ON "_recommendation_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_recommendation_v_version_version_updated_at_idx" ON "_recommendation_v" USING btree ("version_updated_at");
  CREATE INDEX "_recommendation_v_version_version_created_at_idx" ON "_recommendation_v" USING btree ("version_created_at");
  CREATE INDEX "_recommendation_v_version_version__status_idx" ON "_recommendation_v" USING btree ("version__status");
  CREATE INDEX "_recommendation_v_created_at_idx" ON "_recommendation_v" USING btree ("created_at");
  CREATE INDEX "_recommendation_v_updated_at_idx" ON "_recommendation_v" USING btree ("updated_at");
  CREATE INDEX "_recommendation_v_snapshot_idx" ON "_recommendation_v" USING btree ("snapshot");
  CREATE INDEX "_recommendation_v_published_locale_idx" ON "_recommendation_v" USING btree ("published_locale");
  CREATE INDEX "_recommendation_v_latest_idx" ON "_recommendation_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_recommendation_v_locales_locale_parent_id_unique" ON "_recommendation_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_recommendation_v_locales_parent_id_idx" ON "_recommendation_v_locales" USING btree ("_parent_id");
  CREATE INDEX "soum_published_locales_order_idx" ON "soum_published_locales" USING btree ("order");
  CREATE INDEX "soum_published_locales_parent_idx" ON "soum_published_locales" USING btree ("parent_id");
  CREATE INDEX "soum_published_locales_value_idx" ON "soum_published_locales" USING btree ("value");
  CREATE INDEX "soum_slug_idx" ON "soum" USING btree ("slug");
  CREATE INDEX "soum_province_idx" ON "soum" USING btree ("province_id");
  CREATE INDEX "soum_image_idx" ON "soum" USING btree ("image_id");
  CREATE UNIQUE INDEX "soum_contentful_id_idx" ON "soum" USING btree ("contentful_id");
  CREATE INDEX "soum_cf_created_at_idx" ON "soum" USING btree ("cf_created_at");
  CREATE INDEX "soum_updated_at_idx" ON "soum" USING btree ("updated_at");
  CREATE INDEX "soum_created_at_idx" ON "soum" USING btree ("created_at");
  CREATE INDEX "soum__status_idx" ON "soum" USING btree ("_status");
  CREATE UNIQUE INDEX "soum_locales_locale_parent_id_unique" ON "soum_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "soum_locales_parent_id_idx" ON "soum_locales" USING btree ("_parent_id");
  CREATE INDEX "_soum_v_version_published_locales_order_idx" ON "_soum_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_soum_v_version_published_locales_parent_idx" ON "_soum_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_soum_v_version_published_locales_value_idx" ON "_soum_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_soum_v_parent_idx" ON "_soum_v" USING btree ("parent_id");
  CREATE INDEX "_soum_v_version_version_slug_idx" ON "_soum_v" USING btree ("version_slug");
  CREATE INDEX "_soum_v_version_version_province_idx" ON "_soum_v" USING btree ("version_province_id");
  CREATE INDEX "_soum_v_version_version_image_idx" ON "_soum_v" USING btree ("version_image_id");
  CREATE INDEX "_soum_v_version_version_contentful_id_idx" ON "_soum_v" USING btree ("version_contentful_id");
  CREATE INDEX "_soum_v_version_version_cf_created_at_idx" ON "_soum_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_soum_v_version_version_updated_at_idx" ON "_soum_v" USING btree ("version_updated_at");
  CREATE INDEX "_soum_v_version_version_created_at_idx" ON "_soum_v" USING btree ("version_created_at");
  CREATE INDEX "_soum_v_version_version__status_idx" ON "_soum_v" USING btree ("version__status");
  CREATE INDEX "_soum_v_created_at_idx" ON "_soum_v" USING btree ("created_at");
  CREATE INDEX "_soum_v_updated_at_idx" ON "_soum_v" USING btree ("updated_at");
  CREATE INDEX "_soum_v_snapshot_idx" ON "_soum_v" USING btree ("snapshot");
  CREATE INDEX "_soum_v_published_locale_idx" ON "_soum_v" USING btree ("published_locale");
  CREATE INDEX "_soum_v_latest_idx" ON "_soum_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_soum_v_locales_locale_parent_id_unique" ON "_soum_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_soum_v_locales_parent_id_idx" ON "_soum_v_locales" USING btree ("_parent_id");
  CREATE INDEX "species_published_locales_order_idx" ON "species_published_locales" USING btree ("order");
  CREATE INDEX "species_published_locales_parent_idx" ON "species_published_locales" USING btree ("parent_id");
  CREATE INDEX "species_published_locales_value_idx" ON "species_published_locales" USING btree ("value");
  CREATE UNIQUE INDEX "species_slug_idx" ON "species" USING btree ("slug");
  CREATE INDEX "species_group_idx" ON "species" USING btree ("group");
  CREATE INDEX "species_image_idx" ON "species" USING btree ("image_id");
  CREATE UNIQUE INDEX "species_contentful_id_idx" ON "species" USING btree ("contentful_id");
  CREATE INDEX "species_cf_created_at_idx" ON "species" USING btree ("cf_created_at");
  CREATE INDEX "species_updated_at_idx" ON "species" USING btree ("updated_at");
  CREATE INDEX "species_created_at_idx" ON "species" USING btree ("created_at");
  CREATE INDEX "species__status_idx" ON "species" USING btree ("_status");
  CREATE UNIQUE INDEX "species_locales_locale_parent_id_unique" ON "species_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "species_locales_parent_id_idx" ON "species_locales" USING btree ("_parent_id");
  CREATE INDEX "_species_v_version_published_locales_order_idx" ON "_species_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_species_v_version_published_locales_parent_idx" ON "_species_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_species_v_version_published_locales_value_idx" ON "_species_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_species_v_parent_idx" ON "_species_v" USING btree ("parent_id");
  CREATE INDEX "_species_v_version_version_slug_idx" ON "_species_v" USING btree ("version_slug");
  CREATE INDEX "_species_v_version_version_group_idx" ON "_species_v" USING btree ("version_group");
  CREATE INDEX "_species_v_version_version_image_idx" ON "_species_v" USING btree ("version_image_id");
  CREATE INDEX "_species_v_version_version_contentful_id_idx" ON "_species_v" USING btree ("version_contentful_id");
  CREATE INDEX "_species_v_version_version_cf_created_at_idx" ON "_species_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_species_v_version_version_updated_at_idx" ON "_species_v" USING btree ("version_updated_at");
  CREATE INDEX "_species_v_version_version_created_at_idx" ON "_species_v" USING btree ("version_created_at");
  CREATE INDEX "_species_v_version_version__status_idx" ON "_species_v" USING btree ("version__status");
  CREATE INDEX "_species_v_created_at_idx" ON "_species_v" USING btree ("created_at");
  CREATE INDEX "_species_v_updated_at_idx" ON "_species_v" USING btree ("updated_at");
  CREATE INDEX "_species_v_snapshot_idx" ON "_species_v" USING btree ("snapshot");
  CREATE INDEX "_species_v_published_locale_idx" ON "_species_v" USING btree ("published_locale");
  CREATE INDEX "_species_v_latest_idx" ON "_species_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_species_v_locales_locale_parent_id_unique" ON "_species_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_species_v_locales_parent_id_idx" ON "_species_v_locales" USING btree ("_parent_id");
  CREATE INDEX "story_published_locales_order_idx" ON "story_published_locales" USING btree ("order");
  CREATE INDEX "story_published_locales_parent_idx" ON "story_published_locales" USING btree ("parent_id");
  CREATE INDEX "story_published_locales_value_idx" ON "story_published_locales" USING btree ("value");
  CREATE UNIQUE INDEX "story_slug_idx" ON "story" USING btree ("slug");
  CREATE INDEX "story_topic_idx" ON "story" USING btree ("topic");
  CREATE INDEX "story_language_idx" ON "story" USING btree ("language");
  CREATE INDEX "story_og_image_idx" ON "story" USING btree ("og_image_id");
  CREATE INDEX "story_source_type_idx" ON "story" USING btree ("source_type");
  CREATE UNIQUE INDEX "story_contentful_id_idx" ON "story" USING btree ("contentful_id");
  CREATE INDEX "story_cf_created_at_idx" ON "story" USING btree ("cf_created_at");
  CREATE INDEX "story_updated_at_idx" ON "story" USING btree ("updated_at");
  CREATE INDEX "story_created_at_idx" ON "story" USING btree ("created_at");
  CREATE INDEX "story__status_idx" ON "story" USING btree ("_status");
  CREATE UNIQUE INDEX "story_locales_locale_parent_id_unique" ON "story_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "story_locales_parent_id_idx" ON "story_locales" USING btree ("_parent_id");
  CREATE INDEX "story_rels_order_idx" ON "story_rels" USING btree ("order");
  CREATE INDEX "story_rels_parent_idx" ON "story_rels" USING btree ("parent_id");
  CREATE INDEX "story_rels_path_idx" ON "story_rels" USING btree ("path");
  CREATE INDEX "story_rels_media_id_idx" ON "story_rels" USING btree ("media_id");
  CREATE INDEX "story_rels_destination_id_idx" ON "story_rels" USING btree ("destination_id");
  CREATE INDEX "story_rels_heritage_place_id_idx" ON "story_rels" USING btree ("heritage_place_id");
  CREATE INDEX "story_rels_province_id_idx" ON "story_rels" USING btree ("province_id");
  CREATE INDEX "story_rels_community_experience_id_idx" ON "story_rels" USING btree ("community_experience_id");
  CREATE INDEX "story_rels_local_product_id_idx" ON "story_rels" USING btree ("local_product_id");
  CREATE INDEX "_story_v_version_published_locales_order_idx" ON "_story_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_story_v_version_published_locales_parent_idx" ON "_story_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_story_v_version_published_locales_value_idx" ON "_story_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_story_v_parent_idx" ON "_story_v" USING btree ("parent_id");
  CREATE INDEX "_story_v_version_version_slug_idx" ON "_story_v" USING btree ("version_slug");
  CREATE INDEX "_story_v_version_version_topic_idx" ON "_story_v" USING btree ("version_topic");
  CREATE INDEX "_story_v_version_version_language_idx" ON "_story_v" USING btree ("version_language");
  CREATE INDEX "_story_v_version_version_og_image_idx" ON "_story_v" USING btree ("version_og_image_id");
  CREATE INDEX "_story_v_version_version_source_type_idx" ON "_story_v" USING btree ("version_source_type");
  CREATE INDEX "_story_v_version_version_contentful_id_idx" ON "_story_v" USING btree ("version_contentful_id");
  CREATE INDEX "_story_v_version_version_cf_created_at_idx" ON "_story_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_story_v_version_version_updated_at_idx" ON "_story_v" USING btree ("version_updated_at");
  CREATE INDEX "_story_v_version_version_created_at_idx" ON "_story_v" USING btree ("version_created_at");
  CREATE INDEX "_story_v_version_version__status_idx" ON "_story_v" USING btree ("version__status");
  CREATE INDEX "_story_v_created_at_idx" ON "_story_v" USING btree ("created_at");
  CREATE INDEX "_story_v_updated_at_idx" ON "_story_v" USING btree ("updated_at");
  CREATE INDEX "_story_v_snapshot_idx" ON "_story_v" USING btree ("snapshot");
  CREATE INDEX "_story_v_published_locale_idx" ON "_story_v" USING btree ("published_locale");
  CREATE INDEX "_story_v_latest_idx" ON "_story_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_story_v_locales_locale_parent_id_unique" ON "_story_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_story_v_locales_parent_id_idx" ON "_story_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_story_v_rels_order_idx" ON "_story_v_rels" USING btree ("order");
  CREATE INDEX "_story_v_rels_parent_idx" ON "_story_v_rels" USING btree ("parent_id");
  CREATE INDEX "_story_v_rels_path_idx" ON "_story_v_rels" USING btree ("path");
  CREATE INDEX "_story_v_rels_media_id_idx" ON "_story_v_rels" USING btree ("media_id");
  CREATE INDEX "_story_v_rels_destination_id_idx" ON "_story_v_rels" USING btree ("destination_id");
  CREATE INDEX "_story_v_rels_heritage_place_id_idx" ON "_story_v_rels" USING btree ("heritage_place_id");
  CREATE INDEX "_story_v_rels_province_id_idx" ON "_story_v_rels" USING btree ("province_id");
  CREATE INDEX "_story_v_rels_community_experience_id_idx" ON "_story_v_rels" USING btree ("community_experience_id");
  CREATE INDEX "_story_v_rels_local_product_id_idx" ON "_story_v_rels" USING btree ("local_product_id");
  CREATE INDEX "visitor_guidance_published_locales_order_idx" ON "visitor_guidance_published_locales" USING btree ("order");
  CREATE INDEX "visitor_guidance_published_locales_parent_idx" ON "visitor_guidance_published_locales" USING btree ("parent_id");
  CREATE INDEX "visitor_guidance_published_locales_value_idx" ON "visitor_guidance_published_locales" USING btree ("value");
  CREATE UNIQUE INDEX "visitor_guidance_contentful_id_idx" ON "visitor_guidance" USING btree ("contentful_id");
  CREATE INDEX "visitor_guidance_cf_created_at_idx" ON "visitor_guidance" USING btree ("cf_created_at");
  CREATE INDEX "visitor_guidance_updated_at_idx" ON "visitor_guidance" USING btree ("updated_at");
  CREATE INDEX "visitor_guidance_created_at_idx" ON "visitor_guidance" USING btree ("created_at");
  CREATE INDEX "visitor_guidance__status_idx" ON "visitor_guidance" USING btree ("_status");
  CREATE UNIQUE INDEX "visitor_guidance_locales_locale_parent_id_unique" ON "visitor_guidance_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "visitor_guidance_locales_parent_id_idx" ON "visitor_guidance_locales" USING btree ("_parent_id");
  CREATE INDEX "visitor_guidance_texts_order_parent" ON "visitor_guidance_texts" USING btree ("order","parent_id");
  CREATE INDEX "visitor_guidance_texts_locale_parent" ON "visitor_guidance_texts" USING btree ("locale","parent_id");
  CREATE INDEX "visitor_guidance_rels_order_idx" ON "visitor_guidance_rels" USING btree ("order");
  CREATE INDEX "visitor_guidance_rels_parent_idx" ON "visitor_guidance_rels" USING btree ("parent_id");
  CREATE INDEX "visitor_guidance_rels_path_idx" ON "visitor_guidance_rels" USING btree ("path");
  CREATE INDEX "visitor_guidance_rels_destination_id_idx" ON "visitor_guidance_rels" USING btree ("destination_id");
  CREATE INDEX "visitor_guidance_rels_heritage_place_id_idx" ON "visitor_guidance_rels" USING btree ("heritage_place_id");
  CREATE INDEX "visitor_guidance_rels_province_id_idx" ON "visitor_guidance_rels" USING btree ("province_id");
  CREATE INDEX "_visitor_guidance_v_version_published_locales_order_idx" ON "_visitor_guidance_v_version_published_locales" USING btree ("order");
  CREATE INDEX "_visitor_guidance_v_version_published_locales_parent_idx" ON "_visitor_guidance_v_version_published_locales" USING btree ("parent_id");
  CREATE INDEX "_visitor_guidance_v_version_published_locales_value_idx" ON "_visitor_guidance_v_version_published_locales" USING btree ("value");
  CREATE INDEX "_visitor_guidance_v_parent_idx" ON "_visitor_guidance_v" USING btree ("parent_id");
  CREATE INDEX "_visitor_guidance_v_version_version_contentful_id_idx" ON "_visitor_guidance_v" USING btree ("version_contentful_id");
  CREATE INDEX "_visitor_guidance_v_version_version_cf_created_at_idx" ON "_visitor_guidance_v" USING btree ("version_cf_created_at");
  CREATE INDEX "_visitor_guidance_v_version_version_updated_at_idx" ON "_visitor_guidance_v" USING btree ("version_updated_at");
  CREATE INDEX "_visitor_guidance_v_version_version_created_at_idx" ON "_visitor_guidance_v" USING btree ("version_created_at");
  CREATE INDEX "_visitor_guidance_v_version_version__status_idx" ON "_visitor_guidance_v" USING btree ("version__status");
  CREATE INDEX "_visitor_guidance_v_created_at_idx" ON "_visitor_guidance_v" USING btree ("created_at");
  CREATE INDEX "_visitor_guidance_v_updated_at_idx" ON "_visitor_guidance_v" USING btree ("updated_at");
  CREATE INDEX "_visitor_guidance_v_snapshot_idx" ON "_visitor_guidance_v" USING btree ("snapshot");
  CREATE INDEX "_visitor_guidance_v_published_locale_idx" ON "_visitor_guidance_v" USING btree ("published_locale");
  CREATE INDEX "_visitor_guidance_v_latest_idx" ON "_visitor_guidance_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_visitor_guidance_v_locales_locale_parent_id_unique" ON "_visitor_guidance_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_visitor_guidance_v_locales_parent_id_idx" ON "_visitor_guidance_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_visitor_guidance_v_texts_order_parent" ON "_visitor_guidance_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_visitor_guidance_v_texts_locale_parent" ON "_visitor_guidance_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_visitor_guidance_v_rels_order_idx" ON "_visitor_guidance_v_rels" USING btree ("order");
  CREATE INDEX "_visitor_guidance_v_rels_parent_idx" ON "_visitor_guidance_v_rels" USING btree ("parent_id");
  CREATE INDEX "_visitor_guidance_v_rels_path_idx" ON "_visitor_guidance_v_rels" USING btree ("path");
  CREATE INDEX "_visitor_guidance_v_rels_destination_id_idx" ON "_visitor_guidance_v_rels" USING btree ("destination_id");
  CREATE INDEX "_visitor_guidance_v_rels_heritage_place_id_idx" ON "_visitor_guidance_v_rels" USING btree ("heritage_place_id");
  CREATE INDEX "_visitor_guidance_v_rels_province_id_idx" ON "_visitor_guidance_v_rels" USING btree ("province_id");
  CREATE UNIQUE INDEX "media_contentful_id_idx" ON "media" USING btree ("contentful_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_w480_sizes_w480_filename_idx" ON "media" USING btree ("sizes_w480_filename");
  CREATE INDEX "media_sizes_w960_sizes_w960_filename_idx" ON "media" USING btree ("sizes_w960_filename");
  CREATE INDEX "media_sizes_w1600_sizes_w1600_filename_idx" ON "media" USING btree ("sizes_w1600_filename");
  CREATE INDEX "media_sizes_w2400_sizes_w2400_filename_idx" ON "media" USING btree ("sizes_w2400_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_community_experience_id_idx" ON "payload_locked_documents_rels" USING btree ("community_experience_id");
  CREATE INDEX "payload_locked_documents_rels_culture_article_id_idx" ON "payload_locked_documents_rels" USING btree ("culture_article_id");
  CREATE INDEX "payload_locked_documents_rels_culture_heritage_id_idx" ON "payload_locked_documents_rels" USING btree ("culture_heritage_id");
  CREATE INDEX "payload_locked_documents_rels_destination_id_idx" ON "payload_locked_documents_rels" USING btree ("destination_id");
  CREATE INDEX "payload_locked_documents_rels_event_id_idx" ON "payload_locked_documents_rels" USING btree ("event_id");
  CREATE INDEX "payload_locked_documents_rels_faq_item_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_item_id");
  CREATE INDEX "payload_locked_documents_rels_heritage_category_id_idx" ON "payload_locked_documents_rels" USING btree ("heritage_category_id");
  CREATE INDEX "payload_locked_documents_rels_heritage_place_id_idx" ON "payload_locked_documents_rels" USING btree ("heritage_place_id");
  CREATE INDEX "payload_locked_documents_rels_history_article_id_idx" ON "payload_locked_documents_rels" USING btree ("history_article_id");
  CREATE INDEX "payload_locked_documents_rels_local_product_id_idx" ON "payload_locked_documents_rels" USING btree ("local_product_id");
  CREATE INDEX "payload_locked_documents_rels_local_provider_id_idx" ON "payload_locked_documents_rels" USING btree ("local_provider_id");
  CREATE INDEX "payload_locked_documents_rels_place_id_idx" ON "payload_locked_documents_rels" USING btree ("place_id");
  CREATE INDEX "payload_locked_documents_rels_province_id_idx" ON "payload_locked_documents_rels" USING btree ("province_id");
  CREATE INDEX "payload_locked_documents_rels_recommendation_id_idx" ON "payload_locked_documents_rels" USING btree ("recommendation_id");
  CREATE INDEX "payload_locked_documents_rels_soum_id_idx" ON "payload_locked_documents_rels" USING btree ("soum_id");
  CREATE INDEX "payload_locked_documents_rels_species_id_idx" ON "payload_locked_documents_rels" USING btree ("species_id");
  CREATE INDEX "payload_locked_documents_rels_story_id_idx" ON "payload_locked_documents_rels" USING btree ("story_id");
  CREATE INDEX "payload_locked_documents_rels_visitor_guidance_id_idx" ON "payload_locked_documents_rels" USING btree ("visitor_guidance_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "community_experience_published_locales" CASCADE;
  DROP TABLE "community_experience" CASCADE;
  DROP TABLE "community_experience_locales" CASCADE;
  DROP TABLE "community_experience_rels" CASCADE;
  DROP TABLE "_community_experience_v_version_published_locales" CASCADE;
  DROP TABLE "_community_experience_v" CASCADE;
  DROP TABLE "_community_experience_v_locales" CASCADE;
  DROP TABLE "_community_experience_v_rels" CASCADE;
  DROP TABLE "culture_article_published_locales" CASCADE;
  DROP TABLE "culture_article" CASCADE;
  DROP TABLE "culture_article_locales" CASCADE;
  DROP TABLE "_culture_article_v_version_published_locales" CASCADE;
  DROP TABLE "_culture_article_v" CASCADE;
  DROP TABLE "_culture_article_v_locales" CASCADE;
  DROP TABLE "culture_heritage_published_locales" CASCADE;
  DROP TABLE "culture_heritage" CASCADE;
  DROP TABLE "culture_heritage_locales" CASCADE;
  DROP TABLE "_culture_heritage_v_version_published_locales" CASCADE;
  DROP TABLE "_culture_heritage_v" CASCADE;
  DROP TABLE "_culture_heritage_v_locales" CASCADE;
  DROP TABLE "destination_published_locales" CASCADE;
  DROP TABLE "destination" CASCADE;
  DROP TABLE "destination_locales" CASCADE;
  DROP TABLE "destination_rels" CASCADE;
  DROP TABLE "_destination_v_version_published_locales" CASCADE;
  DROP TABLE "_destination_v" CASCADE;
  DROP TABLE "_destination_v_locales" CASCADE;
  DROP TABLE "_destination_v_rels" CASCADE;
  DROP TABLE "event_published_locales" CASCADE;
  DROP TABLE "event" CASCADE;
  DROP TABLE "event_locales" CASCADE;
  DROP TABLE "event_texts" CASCADE;
  DROP TABLE "event_rels" CASCADE;
  DROP TABLE "_event_v_version_published_locales" CASCADE;
  DROP TABLE "_event_v" CASCADE;
  DROP TABLE "_event_v_locales" CASCADE;
  DROP TABLE "_event_v_texts" CASCADE;
  DROP TABLE "_event_v_rels" CASCADE;
  DROP TABLE "faq_item_published_locales" CASCADE;
  DROP TABLE "faq_item" CASCADE;
  DROP TABLE "faq_item_locales" CASCADE;
  DROP TABLE "_faq_item_v_version_published_locales" CASCADE;
  DROP TABLE "_faq_item_v" CASCADE;
  DROP TABLE "_faq_item_v_locales" CASCADE;
  DROP TABLE "heritage_category_published_locales" CASCADE;
  DROP TABLE "heritage_category" CASCADE;
  DROP TABLE "heritage_category_locales" CASCADE;
  DROP TABLE "heritage_category_rels" CASCADE;
  DROP TABLE "_heritage_category_v_version_published_locales" CASCADE;
  DROP TABLE "_heritage_category_v" CASCADE;
  DROP TABLE "_heritage_category_v_locales" CASCADE;
  DROP TABLE "_heritage_category_v_rels" CASCADE;
  DROP TABLE "heritage_place_published_locales" CASCADE;
  DROP TABLE "heritage_place" CASCADE;
  DROP TABLE "heritage_place_locales" CASCADE;
  DROP TABLE "heritage_place_rels" CASCADE;
  DROP TABLE "_heritage_place_v_version_published_locales" CASCADE;
  DROP TABLE "_heritage_place_v" CASCADE;
  DROP TABLE "_heritage_place_v_locales" CASCADE;
  DROP TABLE "_heritage_place_v_rels" CASCADE;
  DROP TABLE "history_article_published_locales" CASCADE;
  DROP TABLE "history_article" CASCADE;
  DROP TABLE "history_article_locales" CASCADE;
  DROP TABLE "_history_article_v_version_published_locales" CASCADE;
  DROP TABLE "_history_article_v" CASCADE;
  DROP TABLE "_history_article_v_locales" CASCADE;
  DROP TABLE "local_product_published_locales" CASCADE;
  DROP TABLE "local_product" CASCADE;
  DROP TABLE "local_product_locales" CASCADE;
  DROP TABLE "local_product_rels" CASCADE;
  DROP TABLE "_local_product_v_version_published_locales" CASCADE;
  DROP TABLE "_local_product_v" CASCADE;
  DROP TABLE "_local_product_v_locales" CASCADE;
  DROP TABLE "_local_product_v_rels" CASCADE;
  DROP TABLE "local_provider_published_locales" CASCADE;
  DROP TABLE "local_provider" CASCADE;
  DROP TABLE "local_provider_locales" CASCADE;
  DROP TABLE "local_provider_texts" CASCADE;
  DROP TABLE "local_provider_rels" CASCADE;
  DROP TABLE "_local_provider_v_version_published_locales" CASCADE;
  DROP TABLE "_local_provider_v" CASCADE;
  DROP TABLE "_local_provider_v_locales" CASCADE;
  DROP TABLE "_local_provider_v_texts" CASCADE;
  DROP TABLE "_local_provider_v_rels" CASCADE;
  DROP TABLE "place_published_locales" CASCADE;
  DROP TABLE "place" CASCADE;
  DROP TABLE "place_locales" CASCADE;
  DROP TABLE "_place_v_version_published_locales" CASCADE;
  DROP TABLE "_place_v" CASCADE;
  DROP TABLE "_place_v_locales" CASCADE;
  DROP TABLE "province_published_locales" CASCADE;
  DROP TABLE "province" CASCADE;
  DROP TABLE "province_locales" CASCADE;
  DROP TABLE "province_rels" CASCADE;
  DROP TABLE "_province_v_version_published_locales" CASCADE;
  DROP TABLE "_province_v" CASCADE;
  DROP TABLE "_province_v_locales" CASCADE;
  DROP TABLE "_province_v_rels" CASCADE;
  DROP TABLE "recommendation_published_locales" CASCADE;
  DROP TABLE "recommendation" CASCADE;
  DROP TABLE "recommendation_locales" CASCADE;
  DROP TABLE "_recommendation_v_version_published_locales" CASCADE;
  DROP TABLE "_recommendation_v" CASCADE;
  DROP TABLE "_recommendation_v_locales" CASCADE;
  DROP TABLE "soum_published_locales" CASCADE;
  DROP TABLE "soum" CASCADE;
  DROP TABLE "soum_locales" CASCADE;
  DROP TABLE "_soum_v_version_published_locales" CASCADE;
  DROP TABLE "_soum_v" CASCADE;
  DROP TABLE "_soum_v_locales" CASCADE;
  DROP TABLE "species_published_locales" CASCADE;
  DROP TABLE "species" CASCADE;
  DROP TABLE "species_locales" CASCADE;
  DROP TABLE "_species_v_version_published_locales" CASCADE;
  DROP TABLE "_species_v" CASCADE;
  DROP TABLE "_species_v_locales" CASCADE;
  DROP TABLE "story_published_locales" CASCADE;
  DROP TABLE "story" CASCADE;
  DROP TABLE "story_locales" CASCADE;
  DROP TABLE "story_rels" CASCADE;
  DROP TABLE "_story_v_version_published_locales" CASCADE;
  DROP TABLE "_story_v" CASCADE;
  DROP TABLE "_story_v_locales" CASCADE;
  DROP TABLE "_story_v_rels" CASCADE;
  DROP TABLE "visitor_guidance_published_locales" CASCADE;
  DROP TABLE "visitor_guidance" CASCADE;
  DROP TABLE "visitor_guidance_locales" CASCADE;
  DROP TABLE "visitor_guidance_texts" CASCADE;
  DROP TABLE "visitor_guidance_rels" CASCADE;
  DROP TABLE "_visitor_guidance_v_version_published_locales" CASCADE;
  DROP TABLE "_visitor_guidance_v" CASCADE;
  DROP TABLE "_visitor_guidance_v_locales" CASCADE;
  DROP TABLE "_visitor_guidance_v_texts" CASCADE;
  DROP TABLE "_visitor_guidance_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_community_experience_published_locales";
  DROP TYPE "public"."enum_community_experience_status";
  DROP TYPE "public"."enum__community_experience_v_version_published_locales";
  DROP TYPE "public"."enum__community_experience_v_version_status";
  DROP TYPE "public"."enum__community_experience_v_published_locale";
  DROP TYPE "public"."enum_culture_article_published_locales";
  DROP TYPE "public"."enum_culture_article_section";
  DROP TYPE "public"."enum_culture_article_status";
  DROP TYPE "public"."enum__culture_article_v_version_published_locales";
  DROP TYPE "public"."enum__culture_article_v_version_section";
  DROP TYPE "public"."enum__culture_article_v_version_status";
  DROP TYPE "public"."enum__culture_article_v_published_locale";
  DROP TYPE "public"."enum_culture_heritage_published_locales";
  DROP TYPE "public"."enum_culture_heritage_status";
  DROP TYPE "public"."enum__culture_heritage_v_version_published_locales";
  DROP TYPE "public"."enum__culture_heritage_v_version_status";
  DROP TYPE "public"."enum__culture_heritage_v_published_locale";
  DROP TYPE "public"."enum_destination_published_locales";
  DROP TYPE "public"."enum_destination_protected_category";
  DROP TYPE "public"."enum_destination_status";
  DROP TYPE "public"."enum__destination_v_version_published_locales";
  DROP TYPE "public"."enum__destination_v_version_protected_category";
  DROP TYPE "public"."enum__destination_v_version_status";
  DROP TYPE "public"."enum__destination_v_published_locale";
  DROP TYPE "public"."enum_event_published_locales";
  DROP TYPE "public"."enum_event_status";
  DROP TYPE "public"."enum__event_v_version_published_locales";
  DROP TYPE "public"."enum__event_v_version_status";
  DROP TYPE "public"."enum__event_v_published_locale";
  DROP TYPE "public"."enum_faq_item_published_locales";
  DROP TYPE "public"."enum_faq_item_status";
  DROP TYPE "public"."enum__faq_item_v_version_published_locales";
  DROP TYPE "public"."enum__faq_item_v_version_status";
  DROP TYPE "public"."enum__faq_item_v_published_locale";
  DROP TYPE "public"."enum_heritage_category_published_locales";
  DROP TYPE "public"."enum_heritage_category_status";
  DROP TYPE "public"."enum__heritage_category_v_version_published_locales";
  DROP TYPE "public"."enum__heritage_category_v_version_status";
  DROP TYPE "public"."enum__heritage_category_v_published_locale";
  DROP TYPE "public"."enum_heritage_place_published_locales";
  DROP TYPE "public"."enum_heritage_place_protected_category";
  DROP TYPE "public"."enum_heritage_place_status";
  DROP TYPE "public"."enum__heritage_place_v_version_published_locales";
  DROP TYPE "public"."enum__heritage_place_v_version_protected_category";
  DROP TYPE "public"."enum__heritage_place_v_version_status";
  DROP TYPE "public"."enum__heritage_place_v_published_locale";
  DROP TYPE "public"."enum_history_article_published_locales";
  DROP TYPE "public"."enum_history_article_period";
  DROP TYPE "public"."enum_history_article_status";
  DROP TYPE "public"."enum__history_article_v_version_published_locales";
  DROP TYPE "public"."enum__history_article_v_version_period";
  DROP TYPE "public"."enum__history_article_v_version_status";
  DROP TYPE "public"."enum__history_article_v_published_locale";
  DROP TYPE "public"."enum_local_product_published_locales";
  DROP TYPE "public"."enum_local_product_status";
  DROP TYPE "public"."enum__local_product_v_version_published_locales";
  DROP TYPE "public"."enum__local_product_v_version_status";
  DROP TYPE "public"."enum__local_product_v_published_locale";
  DROP TYPE "public"."enum_local_provider_published_locales";
  DROP TYPE "public"."enum_local_provider_provider_type";
  DROP TYPE "public"."enum_local_provider_status";
  DROP TYPE "public"."enum__local_provider_v_version_published_locales";
  DROP TYPE "public"."enum__local_provider_v_version_provider_type";
  DROP TYPE "public"."enum__local_provider_v_version_status";
  DROP TYPE "public"."enum__local_provider_v_published_locale";
  DROP TYPE "public"."enum_place_published_locales";
  DROP TYPE "public"."enum_place_category";
  DROP TYPE "public"."enum_place_status";
  DROP TYPE "public"."enum__place_v_version_published_locales";
  DROP TYPE "public"."enum__place_v_version_category";
  DROP TYPE "public"."enum__place_v_version_status";
  DROP TYPE "public"."enum__place_v_published_locale";
  DROP TYPE "public"."enum_province_published_locales";
  DROP TYPE "public"."enum_province_status";
  DROP TYPE "public"."enum__province_v_version_published_locales";
  DROP TYPE "public"."enum__province_v_version_status";
  DROP TYPE "public"."enum__province_v_published_locale";
  DROP TYPE "public"."enum_recommendation_published_locales";
  DROP TYPE "public"."enum_recommendation_status";
  DROP TYPE "public"."enum__recommendation_v_version_published_locales";
  DROP TYPE "public"."enum__recommendation_v_version_status";
  DROP TYPE "public"."enum__recommendation_v_published_locale";
  DROP TYPE "public"."enum_soum_published_locales";
  DROP TYPE "public"."enum_soum_status";
  DROP TYPE "public"."enum__soum_v_version_published_locales";
  DROP TYPE "public"."enum__soum_v_version_status";
  DROP TYPE "public"."enum__soum_v_published_locale";
  DROP TYPE "public"."enum_species_published_locales";
  DROP TYPE "public"."enum_species_group";
  DROP TYPE "public"."enum_species_status";
  DROP TYPE "public"."enum__species_v_version_published_locales";
  DROP TYPE "public"."enum__species_v_version_group";
  DROP TYPE "public"."enum__species_v_version_status";
  DROP TYPE "public"."enum__species_v_published_locale";
  DROP TYPE "public"."enum_story_published_locales";
  DROP TYPE "public"."enum_story_topic";
  DROP TYPE "public"."enum_story_language";
  DROP TYPE "public"."enum_story_source_type";
  DROP TYPE "public"."enum_story_status";
  DROP TYPE "public"."enum__story_v_version_published_locales";
  DROP TYPE "public"."enum__story_v_version_topic";
  DROP TYPE "public"."enum__story_v_version_language";
  DROP TYPE "public"."enum__story_v_version_source_type";
  DROP TYPE "public"."enum__story_v_version_status";
  DROP TYPE "public"."enum__story_v_published_locale";
  DROP TYPE "public"."enum_visitor_guidance_published_locales";
  DROP TYPE "public"."enum_visitor_guidance_status";
  DROP TYPE "public"."enum__visitor_guidance_v_version_published_locales";
  DROP TYPE "public"."enum__visitor_guidance_v_version_status";
  DROP TYPE "public"."enum__visitor_guidance_v_published_locale";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
