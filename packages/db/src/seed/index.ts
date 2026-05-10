import { getDb } from "../client";
import { exercises, personalRecords, templates, workouts } from "../schema";
import { seedDevUser } from "./dev-user";
import { exerciseSeedData } from "./exercises";
import { templateSeedData } from "./templates";

async function seed() {
  const db = getDb();

  // ── Exercises ────────────────────────────────────────────────────────────
  console.log(`Seeding ${exerciseSeedData.length} exercises...`);
  await db
    .insert(exercises)
    .values(exerciseSeedData)
    .onConflictDoNothing({ target: exercises.slug });
  const exerciseCount = await db.$count(exercises);
  console.log(`  Exercises: ${exerciseCount}`);

  // ── Templates ────────────────────────────────────────────────────────────
  console.log(`Seeding ${templateSeedData.length} templates...`);
  await db
    .insert(templates)
    .values(templateSeedData)
    .onConflictDoNothing({ target: templates.slug });
  const templateCount = await db.$count(templates);
  console.log(`  Templates: ${templateCount}`);

  // ── Dev User ─────────────────────────────────────────────────────────────
  console.log("Seeding dev user...");
  await seedDevUser(db);

  // ── Summary ──────────────────────────────────────────────────────────────
  const workoutCount = await db.$count(workouts);
  const prCount = await db.$count(personalRecords);

  console.log("\n─── Seed summary ───────────────────────────────────");
  console.log(`  Exercises :  ${exerciseCount}`);
  console.log(`  Templates :  ${templateCount}`);
  console.log(`  Workouts  :  ${workoutCount}`);
  console.log(`  PRs       :  ${prCount}`);
  console.log("────────────────────────────────────────────────────");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
