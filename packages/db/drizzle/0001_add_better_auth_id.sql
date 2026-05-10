ALTER TABLE "users" ADD COLUMN "better_auth_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX "users_better_auth_id_unique" ON "users" ("better_auth_id");
