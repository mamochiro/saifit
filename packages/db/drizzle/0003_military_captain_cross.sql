CREATE TABLE "body_measurements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"recorded_at" date NOT NULL,
	"weight_kg" numeric(5, 2),
	"body_fat_pct" numeric(4, 1),
	"chest_cm" numeric(5, 1),
	"waist_cm" numeric(5, 1),
	"arm_cm" numeric(5, 1),
	"thigh_cm" numeric(5, 1),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"log_date" date NOT NULL,
	"target_kcal" integer DEFAULT 2100 NOT NULL,
	"target_protein_g" integer DEFAULT 150 NOT NULL,
	"target_carbs_g" integer DEFAULT 220 NOT NULL,
	"target_fat_g" integer DEFAULT 70 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"food_log_id" uuid NOT NULL,
	"meal_type" text NOT NULL,
	"name" text NOT NULL,
	"kcal" integer NOT NULL,
	"protein_g" numeric(5, 1) NOT NULL,
	"carbs_g" numeric(5, 1) NOT NULL,
	"fat_g" numeric(5, 1) NOT NULL,
	"is_done" boolean DEFAULT false NOT NULL,
	"logged_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "running_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"run_date" date NOT NULL,
	"distance_km" numeric(6, 2) NOT NULL,
	"duration_seconds" integer NOT NULL,
	"avg_pace_sec_per_km" integer,
	"run_type" text DEFAULT 'easy' NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "body_measurements" ADD CONSTRAINT "body_measurements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_logs" ADD CONSTRAINT "food_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meal_items" ADD CONSTRAINT "meal_items_food_log_id_food_logs_id_fk" FOREIGN KEY ("food_log_id") REFERENCES "public"."food_logs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "running_sessions" ADD CONSTRAINT "running_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "food_logs_user_date_idx" ON "food_logs" USING btree ("user_id","log_date");