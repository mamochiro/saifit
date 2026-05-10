ALTER TABLE "users" ADD COLUMN "default_target_kcal" integer DEFAULT 2100 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "default_target_protein_g" integer DEFAULT 150 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "default_target_carbs_g" integer DEFAULT 220 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "default_target_fat_g" integer DEFAULT 70 NOT NULL;