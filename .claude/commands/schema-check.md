# /schema-check — Validate DB schema against spec

Audit `packages/db/src/schema.ts` against the GymPal schema spec. Report any missing fields, wrong types, or missing constraints.

## Check each table:

### users
Required fields: id (uuid pk), lineUserId (unique nullable), displayName, email, avatarUrl, locale ('th'|'en'), goal, experienceLevel, daysPerWeek, gymType, unitsPreference ('kg'|'lb'), defaultRestSeconds, reminderTime, reminderEnabled, timezone (default 'Asia/Bangkok'), onboardedAt, createdAt, updatedAt

### exercises
Required fields: id, slug (unique), nameEn, nameTh, muscleGroups (TEXT ARRAY — not single string), secondaryMuscles (jsonb), equipment, difficulty (1-5), beginnerCueTh, beginnerCueEn, commonMistakeTh, commonMistakeEn, instructionsTh, instructionsEn, gifUrl, imageUrl, youtubeUrl, isCompound, isBodyweight (boolean)

### workoutSets
Required fields: id, workoutId (fk cascade), exerciseId (fk), setNumber, reps, weightKg (NULLABLE — bodyweight exercises), isBodyweight (boolean default false), rpe, isWarmup, completedAt, notes

### templates
Required fields: id, slug, nameEn, nameTh, descriptionEn, descriptionTh, daysPerWeek, difficulty, goal, estimatedDurationMin, splitJson (jsonb), isPublic

### personalRecords
Required types: '1rm_estimated' | 'max_weight' | 'max_reps' | 'max_volume_set'

### streaks
Check: grace day logic requires lastGraceUsedAt column or similar — verify it exists

## Check indexes:
- users.lineUserId
- workouts(userId, startedAt DESC)
- workoutSets.workoutId
- personalRecords(userId, exerciseId)

## Check RLS markers:
All user-scoped tables should have a comment or policy marker.
Public tables (exercises, templates) should be read-only.

## Report:
For each table: ✅ correct / ❌ missing field / ⚠️ wrong type
Suggest the exact Drizzle code to fix any issues found.
