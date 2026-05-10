ALTER TABLE "workout_sets" ADD COLUMN "client_set_id" varchar(36);--> statement-breakpoint
CREATE UNIQUE INDEX "idx_workout_sets_client_set_id" ON "workout_sets" USING btree ("workout_id","client_set_id");
