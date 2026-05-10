import type { InferInsertModel } from "drizzle-orm";
import type { templates } from "../schema";

type TemplateInsert = InferInsertModel<typeof templates>;

type SplitJson = {
  days: Array<{
    dayLabel: string;
    exercises: Array<{
      exerciseSlug: string;
      sets: number;
      reps: string;
      notes?: string;
    }>;
  }>;
};

function split(days: SplitJson["days"]): SplitJson {
  return { days };
}

export const templateSeedData: Omit<TemplateInsert, "id" | "createdAt">[] = [
  // 1 ─ Beginner Full Body 3-Day ────────────────────────────────────────────
  {
    slug: "beginner-full-body-3day",
    nameEn: "Beginner Full Body 3×/Week",
    nameTh: "ฝึกทั้งตัว 3 วัน/สัปดาห์ สำหรับมือใหม่",
    descriptionEn:
      "A simple 3-day program hitting every muscle group each session. Perfect for beginners building the base.",
    descriptionTh: "โปรแกรม 3 วันที่ฝึกทุกกลุ่มกล้ามเนื้อในแต่ละครั้ง เหมาะสำหรับมือใหม่ที่ต้องการสร้างพื้นฐาน",
    goal: "build_muscle",
    difficulty: "beginner",
    daysPerWeek: 3,
    isAdvanced: false,
    splitJson: split([
      {
        dayLabel: "Full Body A",
        exercises: [
          { exerciseSlug: "squat", sets: 3, reps: "8-10" },
          { exerciseSlug: "barbell-bench-press", sets: 3, reps: "8-10" },
          { exerciseSlug: "barbell-row", sets: 3, reps: "8-10" },
          { exerciseSlug: "dumbbell-curl", sets: 2, reps: "10-12" },
          { exerciseSlug: "plank", sets: 3, reps: "30s", notes: "Hold 30 seconds" },
        ],
      },
      {
        dayLabel: "Full Body B",
        exercises: [
          { exerciseSlug: "deadlift", sets: 3, reps: "6-8" },
          { exerciseSlug: "overhead-press", sets: 3, reps: "8-10" },
          { exerciseSlug: "lat-pulldown", sets: 3, reps: "10-12" },
          { exerciseSlug: "tricep-pushdown", sets: 2, reps: "10-12" },
          { exerciseSlug: "crunch", sets: 3, reps: "15-20" },
        ],
      },
      {
        dayLabel: "Full Body C",
        exercises: [
          { exerciseSlug: "leg-press", sets: 3, reps: "10-12" },
          { exerciseSlug: "incline-bench-press", sets: 3, reps: "8-10" },
          { exerciseSlug: "seated-cable-row", sets: 3, reps: "10-12" },
          { exerciseSlug: "hammer-curl", sets: 2, reps: "10-12" },
          { exerciseSlug: "leg-curl", sets: 3, reps: "10-12" },
        ],
      },
    ]),
  },

  // 2 ─ PPL 6-Day ───────────────────────────────────────────────────────────
  {
    slug: "ppl-6day",
    nameEn: "Push Pull Legs 6×/Week",
    nameTh: "พุช พูล เลกส์ 6 วัน/สัปดาห์",
    descriptionEn:
      "High-frequency PPL split training each muscle group twice per week. For dedicated intermediate-to-advanced lifters.",
    descriptionTh: "โปรแกรม PPL ที่ฝึกแต่ละกล้ามเนื้อสองครั้งต่อสัปดาห์ เหมาะกับผู้ที่มีประสบการณ์และมุ่งมั่น",
    goal: "build_muscle",
    difficulty: "advanced",
    daysPerWeek: 6,
    isAdvanced: true,
    splitJson: split([
      {
        dayLabel: "Push 1 (Chest Focus)",
        exercises: [
          { exerciseSlug: "barbell-bench-press", sets: 4, reps: "6-8" },
          { exerciseSlug: "incline-bench-press", sets: 3, reps: "8-10" },
          { exerciseSlug: "overhead-press", sets: 3, reps: "8-10" },
          { exerciseSlug: "lateral-raise", sets: 4, reps: "12-15" },
          { exerciseSlug: "tricep-pushdown", sets: 3, reps: "12-15" },
          { exerciseSlug: "skull-crusher", sets: 3, reps: "10-12" },
        ],
      },
      {
        dayLabel: "Pull 1 (Back Focus)",
        exercises: [
          { exerciseSlug: "deadlift", sets: 4, reps: "4-6" },
          { exerciseSlug: "barbell-row", sets: 4, reps: "6-8" },
          { exerciseSlug: "lat-pulldown", sets: 3, reps: "10-12" },
          { exerciseSlug: "face-pull", sets: 4, reps: "15-20" },
          { exerciseSlug: "barbell-curl", sets: 3, reps: "8-10" },
          { exerciseSlug: "hammer-curl", sets: 3, reps: "10-12" },
        ],
      },
      {
        dayLabel: "Legs 1 (Quad Focus)",
        exercises: [
          { exerciseSlug: "squat", sets: 4, reps: "6-8" },
          { exerciseSlug: "leg-press", sets: 4, reps: "10-12" },
          { exerciseSlug: "romanian-deadlift", sets: 3, reps: "8-10" },
          { exerciseSlug: "leg-curl", sets: 3, reps: "12-15" },
          { exerciseSlug: "calf-raise", sets: 4, reps: "15-20" },
        ],
      },
      {
        dayLabel: "Push 2 (Shoulder Focus)",
        exercises: [
          { exerciseSlug: "dumbbell-shoulder-press", sets: 4, reps: "8-10" },
          { exerciseSlug: "incline-dumbbell-fly", sets: 3, reps: "10-12" },
          { exerciseSlug: "cable-fly", sets: 3, reps: "12-15" },
          { exerciseSlug: "cable-lateral-raise", sets: 4, reps: "12-15" },
          { exerciseSlug: "overhead-tricep-extension", sets: 3, reps: "10-12" },
          { exerciseSlug: "close-grip-bench", sets: 3, reps: "10-12" },
        ],
      },
      {
        dayLabel: "Pull 2 (Lats Focus)",
        exercises: [
          { exerciseSlug: "pull-up", sets: 4, reps: "6-10" },
          { exerciseSlug: "seated-cable-row", sets: 4, reps: "10-12" },
          { exerciseSlug: "t-bar-row", sets: 3, reps: "8-10" },
          { exerciseSlug: "rear-delt-fly", sets: 4, reps: "12-15" },
          { exerciseSlug: "preacher-curl", sets: 3, reps: "10-12" },
          { exerciseSlug: "concentration-curl", sets: 3, reps: "12-15" },
        ],
      },
      {
        dayLabel: "Legs 2 (Posterior Chain)",
        exercises: [
          { exerciseSlug: "front-squat", sets: 4, reps: "6-8" },
          { exerciseSlug: "hack-squat", sets: 4, reps: "10-12" },
          { exerciseSlug: "split-squat", sets: 3, reps: "10-12" },
          { exerciseSlug: "leg-extension", sets: 3, reps: "12-15" },
          { exerciseSlug: "hip-thrust", sets: 4, reps: "12-15" },
          { exerciseSlug: "calf-raise", sets: 4, reps: "15-20" },
        ],
      },
    ]),
  },

  // 3 ─ Upper Lower 4-Day ───────────────────────────────────────────────────
  {
    slug: "upper-lower-4day",
    nameEn: "Upper/Lower 4×/Week",
    nameTh: "บน-ล่าง 4 วัน/สัปดาห์",
    descriptionEn:
      "Classic 4-day upper/lower split with strength focus on the first day and hypertrophy on the second.",
    descriptionTh: "โปรแกรม 4 วันแบบบน-ล่างที่เน้นความแข็งแรงในวันแรกและ Hypertrophy ในวันที่สอง",
    goal: "build_muscle",
    difficulty: "intermediate",
    daysPerWeek: 4,
    isAdvanced: false,
    splitJson: split([
      {
        dayLabel: "Upper A (Strength)",
        exercises: [
          { exerciseSlug: "barbell-bench-press", sets: 4, reps: "4-6" },
          { exerciseSlug: "barbell-row", sets: 4, reps: "4-6" },
          { exerciseSlug: "overhead-press", sets: 3, reps: "6-8" },
          { exerciseSlug: "lat-pulldown", sets: 3, reps: "8-10" },
          { exerciseSlug: "barbell-curl", sets: 3, reps: "8-10" },
          { exerciseSlug: "tricep-pushdown", sets: 3, reps: "10-12" },
        ],
      },
      {
        dayLabel: "Lower A (Strength)",
        exercises: [
          { exerciseSlug: "squat", sets: 4, reps: "4-6" },
          { exerciseSlug: "romanian-deadlift", sets: 3, reps: "6-8" },
          { exerciseSlug: "leg-press", sets: 3, reps: "8-10" },
          { exerciseSlug: "leg-curl", sets: 3, reps: "10-12" },
          { exerciseSlug: "calf-raise", sets: 4, reps: "12-15" },
        ],
      },
      {
        dayLabel: "Upper B (Hypertrophy)",
        exercises: [
          { exerciseSlug: "incline-bench-press", sets: 4, reps: "8-12" },
          { exerciseSlug: "seated-cable-row", sets: 4, reps: "10-12" },
          { exerciseSlug: "dumbbell-shoulder-press", sets: 3, reps: "10-12" },
          { exerciseSlug: "pull-up", sets: 3, reps: "8-12" },
          { exerciseSlug: "hammer-curl", sets: 3, reps: "12-15" },
          { exerciseSlug: "overhead-tricep-extension", sets: 3, reps: "12-15" },
        ],
      },
      {
        dayLabel: "Lower B (Hypertrophy)",
        exercises: [
          { exerciseSlug: "deadlift", sets: 4, reps: "4-6" },
          { exerciseSlug: "hack-squat", sets: 3, reps: "10-12" },
          { exerciseSlug: "leg-extension", sets: 3, reps: "12-15" },
          { exerciseSlug: "hip-thrust", sets: 4, reps: "12-15" },
          { exerciseSlug: "calf-raise", sets: 4, reps: "15-20" },
        ],
      },
    ]),
  },

  // 4 ─ Push Pull 4-Day ─────────────────────────────────────────────────────
  {
    slug: "push-pull-4day",
    nameEn: "Push/Pull 4×/Week",
    nameTh: "พุช/พูล 4 วัน/สัปดาห์",
    descriptionEn:
      "4-day push/pull split, each muscle group trained twice per week with varying rep ranges.",
    descriptionTh: "โปรแกรม 4 วันแบบพุช/พูล ฝึกแต่ละกลุ่มกล้ามเนื้อสองครั้งต่อสัปดาห์ด้วยช่วง rep ที่หลากหลาย",
    goal: "build_muscle",
    difficulty: "intermediate",
    daysPerWeek: 4,
    isAdvanced: false,
    splitJson: split([
      {
        dayLabel: "Push A (Heavy)",
        exercises: [
          { exerciseSlug: "barbell-bench-press", sets: 4, reps: "5-6" },
          { exerciseSlug: "overhead-press", sets: 3, reps: "6-8" },
          { exerciseSlug: "incline-bench-press", sets: 3, reps: "8-10" },
          { exerciseSlug: "lateral-raise", sets: 4, reps: "12-15" },
          { exerciseSlug: "tricep-pushdown", sets: 3, reps: "10-12" },
        ],
      },
      {
        dayLabel: "Pull A (Heavy)",
        exercises: [
          { exerciseSlug: "deadlift", sets: 3, reps: "4-5" },
          { exerciseSlug: "pull-up", sets: 4, reps: "6-10" },
          { exerciseSlug: "barbell-row", sets: 4, reps: "6-8" },
          { exerciseSlug: "face-pull", sets: 4, reps: "15-20" },
          { exerciseSlug: "barbell-curl", sets: 3, reps: "8-10" },
        ],
      },
      {
        dayLabel: "Push B (Volume)",
        exercises: [
          { exerciseSlug: "dumbbell-shoulder-press", sets: 4, reps: "10-12" },
          { exerciseSlug: "cable-fly", sets: 4, reps: "12-15" },
          { exerciseSlug: "chest-press-machine", sets: 3, reps: "12-15" },
          { exerciseSlug: "cable-lateral-raise", sets: 4, reps: "15-20" },
          { exerciseSlug: "skull-crusher", sets: 3, reps: "10-12" },
        ],
      },
      {
        dayLabel: "Pull B (Volume)",
        exercises: [
          { exerciseSlug: "seated-cable-row", sets: 4, reps: "10-12" },
          { exerciseSlug: "lat-pulldown", sets: 4, reps: "10-12" },
          { exerciseSlug: "dumbbell-row", sets: 3, reps: "10-12" },
          { exerciseSlug: "rear-delt-fly", sets: 4, reps: "15-20" },
          { exerciseSlug: "hammer-curl", sets: 3, reps: "12-15" },
        ],
      },
    ]),
  },

  // 5 ─ Home No Equipment 3-Day ─────────────────────────────────────────────
  {
    slug: "home-no-equipment-3day",
    nameEn: "Home Bodyweight 3×/Week",
    nameTh: "ออกกำลังกายที่บ้าน ไม่มีอุปกรณ์ 3 วัน/สัปดาห์",
    descriptionEn:
      "Zero-equipment home program. Burns fat and builds functional strength using only bodyweight.",
    descriptionTh: "โปรแกรมที่บ้านไม่ต้องใช้อุปกรณ์ ช่วยเผาผลาญไขมันและสร้างความแข็งแรงด้วยน้ำหนักตัว",
    goal: "stay_active",
    difficulty: "beginner",
    daysPerWeek: 3,
    isAdvanced: false,
    splitJson: split([
      {
        dayLabel: "Day A (Upper Body)",
        exercises: [
          { exerciseSlug: "push-up", sets: 4, reps: "10-15" },
          { exerciseSlug: "wide-push-up", sets: 3, reps: "10-15" },
          { exerciseSlug: "tricep-dip", sets: 3, reps: "10-12" },
          { exerciseSlug: "plank", sets: 3, reps: "30-60s" },
          { exerciseSlug: "dead-bug", sets: 3, reps: "8-10" },
        ],
      },
      {
        dayLabel: "Day B (Lower Body)",
        exercises: [
          { exerciseSlug: "burpee", sets: 3, reps: "8-12" },
          { exerciseSlug: "mountain-climber", sets: 3, reps: "20-30" },
          { exerciseSlug: "high-knees", sets: 3, reps: "30s" },
          { exerciseSlug: "v-up", sets: 3, reps: "10-15" },
          { exerciseSlug: "bicycle-crunch", sets: 3, reps: "15-20" },
        ],
      },
      {
        dayLabel: "Day C (Full Body HIIT)",
        exercises: [
          { exerciseSlug: "burpee", sets: 4, reps: "10-15" },
          { exerciseSlug: "push-up", sets: 3, reps: "12-15" },
          { exerciseSlug: "hollow-hold", sets: 3, reps: "20-30s" },
          { exerciseSlug: "side-plank", sets: 3, reps: "20-30s" },
          { exerciseSlug: "leg-raise", sets: 3, reps: "10-15" },
        ],
      },
    ]),
  },

  // 6 ─ Home Dumbbell 3-Day ─────────────────────────────────────────────────
  {
    slug: "home-dumbbell-3day",
    nameEn: "Home Dumbbell 3×/Week",
    nameTh: "ออกกำลังกายที่บ้านด้วยดัมเบล 3 วัน/สัปดาห์",
    descriptionEn: "Build muscle at home with just a pair of dumbbells. Full body over 3 sessions.",
    descriptionTh: "สร้างกล้ามเนื้อที่บ้านด้วยดัมเบลเพียงคู่เดียว ฝึกทั้งตัวใน 3 ครั้ง",
    goal: "build_muscle",
    difficulty: "beginner",
    daysPerWeek: 3,
    isAdvanced: false,
    splitJson: split([
      {
        dayLabel: "Day A (Push + Core)",
        exercises: [
          { exerciseSlug: "dumbbell-shoulder-press", sets: 3, reps: "10-12" },
          { exerciseSlug: "incline-dumbbell-fly", sets: 3, reps: "10-12" },
          { exerciseSlug: "lateral-raise", sets: 3, reps: "12-15" },
          { exerciseSlug: "overhead-tricep-extension", sets: 3, reps: "12-15" },
          { exerciseSlug: "plank", sets: 3, reps: "30s" },
        ],
      },
      {
        dayLabel: "Day B (Pull + Legs)",
        exercises: [
          { exerciseSlug: "dumbbell-row", sets: 3, reps: "10-12" },
          { exerciseSlug: "dumbbell-curl", sets: 3, reps: "10-12" },
          { exerciseSlug: "hammer-curl", sets: 3, reps: "10-12" },
          { exerciseSlug: "goblet-squat", sets: 3, reps: "12-15" },
          { exerciseSlug: "romanian-deadlift", sets: 3, reps: "10-12" },
        ],
      },
      {
        dayLabel: "Day C (Full Body)",
        exercises: [
          { exerciseSlug: "arnold-press", sets: 3, reps: "10-12" },
          { exerciseSlug: "rear-delt-fly", sets: 3, reps: "12-15" },
          { exerciseSlug: "concentration-curl", sets: 3, reps: "12-15" },
          { exerciseSlug: "walking-lunge", sets: 3, reps: "10-12" },
          { exerciseSlug: "reverse-lunge", sets: 3, reps: "10-12" },
        ],
      },
    ]),
  },

  // 7 ─ Strength 5×5 3-Day ──────────────────────────────────────────────────
  {
    slug: "strength-5x5-3day",
    nameEn: "Strength 5×5 3×/Week",
    nameTh: "เพิ่มความแข็งแรง 5×5 สามวัน/สัปดาห์",
    descriptionEn:
      "The classic strength protocol. Squat every session, add weight each week on the big three lifts.",
    descriptionTh: "โปรแกรมความแข็งแรงคลาสสิก สควอตทุกครั้ง เพิ่มน้ำหนักทุกสัปดาห์ใน 3 ท่าหลัก",
    goal: "get_stronger",
    difficulty: "intermediate",
    daysPerWeek: 3,
    isAdvanced: false,
    splitJson: split([
      {
        dayLabel: "Workout A",
        exercises: [
          { exerciseSlug: "squat", sets: 5, reps: "5", notes: "Add 2.5kg each session" },
          {
            exerciseSlug: "barbell-bench-press",
            sets: 5,
            reps: "5",
            notes: "Add 2.5kg each A workout",
          },
          { exerciseSlug: "barbell-row", sets: 5, reps: "5", notes: "Add 2.5kg each session" },
        ],
      },
      {
        dayLabel: "Workout B",
        exercises: [
          { exerciseSlug: "squat", sets: 5, reps: "5", notes: "Add 2.5kg each session" },
          { exerciseSlug: "overhead-press", sets: 5, reps: "5", notes: "Add 2.5kg each B workout" },
          { exerciseSlug: "deadlift", sets: 1, reps: "5", notes: "Add 5kg each session" },
        ],
      },
      {
        dayLabel: "Workout A (repeat)",
        exercises: [
          { exerciseSlug: "squat", sets: 5, reps: "5", notes: "Add 2.5kg each session" },
          {
            exerciseSlug: "barbell-bench-press",
            sets: 5,
            reps: "5",
            notes: "Add 2.5kg each A workout",
          },
          { exerciseSlug: "barbell-row", sets: 5, reps: "5", notes: "Add 2.5kg each session" },
        ],
      },
    ]),
  },

  // 8 ─ Hypertrophy 5-Day ───────────────────────────────────────────────────
  {
    slug: "hypertrophy-5day",
    nameEn: "Hypertrophy Bro Split 5×/Week",
    nameTh: "โปรแกรม Hypertrophy แบบ Bro Split 5 วัน/สัปดาห์",
    descriptionEn:
      "Dedicated one-muscle-group-per-day split with high volume. Maximise time under tension for each muscle.",
    descriptionTh: "โปรแกรมที่ฝึกกล้ามเนื้อหนึ่งกลุ่มต่อวัน ปริมาณสูง เพื่อเพิ่ม Time Under Tension สูงสุด",
    goal: "build_muscle",
    difficulty: "advanced",
    daysPerWeek: 5,
    isAdvanced: true,
    splitJson: split([
      {
        dayLabel: "Chest Day",
        exercises: [
          { exerciseSlug: "barbell-bench-press", sets: 4, reps: "6-8" },
          { exerciseSlug: "incline-bench-press", sets: 4, reps: "8-10" },
          { exerciseSlug: "cable-fly", sets: 3, reps: "12-15" },
          { exerciseSlug: "cable-crossover", sets: 3, reps: "12-15" },
          { exerciseSlug: "chest-press-machine", sets: 3, reps: "12-15" },
          { exerciseSlug: "pec-deck", sets: 3, reps: "12-15" },
        ],
      },
      {
        dayLabel: "Back Day",
        exercises: [
          { exerciseSlug: "deadlift", sets: 4, reps: "5-6" },
          { exerciseSlug: "pull-up", sets: 4, reps: "8-10" },
          { exerciseSlug: "barbell-row", sets: 4, reps: "8-10" },
          { exerciseSlug: "lat-pulldown", sets: 3, reps: "10-12" },
          { exerciseSlug: "seated-cable-row", sets: 3, reps: "10-12" },
          { exerciseSlug: "face-pull", sets: 4, reps: "15-20" },
        ],
      },
      {
        dayLabel: "Leg Day",
        exercises: [
          { exerciseSlug: "squat", sets: 4, reps: "6-8" },
          { exerciseSlug: "hack-squat", sets: 4, reps: "10-12" },
          { exerciseSlug: "romanian-deadlift", sets: 3, reps: "8-10" },
          { exerciseSlug: "leg-press", sets: 3, reps: "12-15" },
          { exerciseSlug: "leg-curl", sets: 4, reps: "10-12" },
          { exerciseSlug: "calf-raise", sets: 5, reps: "15-20" },
          { exerciseSlug: "hip-thrust", sets: 4, reps: "12-15" },
        ],
      },
      {
        dayLabel: "Shoulder Day",
        exercises: [
          { exerciseSlug: "overhead-press", sets: 4, reps: "6-8" },
          { exerciseSlug: "lateral-raise", sets: 5, reps: "12-15" },
          { exerciseSlug: "rear-delt-fly", sets: 4, reps: "12-15" },
          { exerciseSlug: "front-raise", sets: 3, reps: "12-15" },
          { exerciseSlug: "arnold-press", sets: 3, reps: "10-12" },
          { exerciseSlug: "cable-lateral-raise", sets: 4, reps: "15-20" },
        ],
      },
      {
        dayLabel: "Arm Day",
        exercises: [
          { exerciseSlug: "barbell-curl", sets: 4, reps: "8-10" },
          { exerciseSlug: "preacher-curl", sets: 3, reps: "10-12" },
          { exerciseSlug: "hammer-curl", sets: 3, reps: "10-12" },
          { exerciseSlug: "tricep-pushdown", sets: 4, reps: "10-12" },
          { exerciseSlug: "skull-crusher", sets: 3, reps: "10-12" },
          { exerciseSlug: "overhead-tricep-extension", sets: 3, reps: "12-15" },
        ],
      },
    ]),
  },

  // 9 ─ Female Glute Focus 4-Day ─────────────────────────────────────────────
  {
    slug: "female-glute-focus-4day",
    nameEn: "Glute & Leg Focus 4×/Week",
    nameTh: "เน้นก้นและขา 4 วัน/สัปดาห์",
    descriptionEn:
      "4-day program with twice-weekly glute/leg training plus full upper body sessions. Great for shaping the lower body.",
    descriptionTh:
      "โปรแกรม 4 วันที่ฝึกก้นและขาสองครั้ง พร้อมฝึกร่างกายส่วนบนครบถ้วน เหมาะสำหรับการปั้นรูปร่างส่วนล่าง",
    goal: "build_muscle",
    difficulty: "intermediate",
    daysPerWeek: 4,
    isAdvanced: false,
    splitJson: split([
      {
        dayLabel: "Glutes & Hamstrings A",
        exercises: [
          { exerciseSlug: "hip-thrust", sets: 4, reps: "10-12" },
          { exerciseSlug: "romanian-deadlift", sets: 3, reps: "10-12" },
          { exerciseSlug: "leg-curl", sets: 4, reps: "12-15" },
          { exerciseSlug: "reverse-lunge", sets: 3, reps: "10-12" },
          { exerciseSlug: "adductor-machine", sets: 3, reps: "12-15" },
        ],
      },
      {
        dayLabel: "Upper Body",
        exercises: [
          { exerciseSlug: "lat-pulldown", sets: 4, reps: "10-12" },
          { exerciseSlug: "seated-cable-row", sets: 3, reps: "10-12" },
          { exerciseSlug: "dumbbell-shoulder-press", sets: 3, reps: "10-12" },
          { exerciseSlug: "lateral-raise", sets: 4, reps: "12-15" },
          { exerciseSlug: "dumbbell-curl", sets: 3, reps: "12-15" },
          { exerciseSlug: "tricep-pushdown", sets: 3, reps: "12-15" },
        ],
      },
      {
        dayLabel: "Quads & Glutes B",
        exercises: [
          { exerciseSlug: "squat", sets: 4, reps: "8-10" },
          { exerciseSlug: "leg-press", sets: 4, reps: "12-15" },
          { exerciseSlug: "split-squat", sets: 3, reps: "10-12" },
          { exerciseSlug: "leg-extension", sets: 3, reps: "12-15" },
          { exerciseSlug: "calf-raise", sets: 4, reps: "15-20" },
        ],
      },
      {
        dayLabel: "Full Body & Core",
        exercises: [
          { exerciseSlug: "sumo-deadlift", sets: 4, reps: "8-10" },
          { exerciseSlug: "incline-bench-press", sets: 3, reps: "10-12" },
          { exerciseSlug: "pull-up", sets: 3, reps: "6-10" },
          { exerciseSlug: "step-up", sets: 3, reps: "10-12" },
          { exerciseSlug: "plank", sets: 3, reps: "45s" },
          { exerciseSlug: "bicycle-crunch", sets: 3, reps: "15-20" },
        ],
      },
    ]),
  },

  // 10 ─ Beginner 2-Day Minimum ─────────────────────────────────────────────
  {
    slug: "beginner-2day-minimum",
    nameEn: "Minimum Effective Dose 2×/Week",
    nameTh: "ออกกำลังกายขั้นต่ำ 2 วัน/สัปดาห์",
    descriptionEn:
      "The bare minimum for making progress. Two full-body sessions for busy people who still want results.",
    descriptionTh: "ขั้นต่ำสำหรับการพัฒนา สองครั้งต่อสัปดาห์สำหรับคนยุ่งที่ยังอยากได้ผลลัพธ์",
    goal: "stay_active",
    difficulty: "beginner",
    daysPerWeek: 2,
    isAdvanced: false,
    splitJson: split([
      {
        dayLabel: "Day A",
        exercises: [
          { exerciseSlug: "squat", sets: 3, reps: "8-10" },
          { exerciseSlug: "barbell-bench-press", sets: 3, reps: "8-10" },
          { exerciseSlug: "barbell-row", sets: 3, reps: "8-10" },
          { exerciseSlug: "overhead-press", sets: 2, reps: "10-12" },
          { exerciseSlug: "plank", sets: 3, reps: "30s" },
        ],
      },
      {
        dayLabel: "Day B",
        exercises: [
          { exerciseSlug: "deadlift", sets: 3, reps: "6-8" },
          { exerciseSlug: "lat-pulldown", sets: 3, reps: "10-12" },
          { exerciseSlug: "leg-press", sets: 3, reps: "10-12" },
          { exerciseSlug: "dumbbell-shoulder-press", sets: 2, reps: "10-12" },
          { exerciseSlug: "crunch", sets: 3, reps: "15-20" },
        ],
      },
    ]),
  },

  // 11 ─ Intermediate Powerbuilding 4-Day ───────────────────────────────────
  {
    slug: "intermediate-powerbuilding-4day",
    nameEn: "Powerbuilding 4×/Week",
    nameTh: "Powerbuilding 4 วัน/สัปดาห์",
    descriptionEn:
      "Combines strength work (low reps, heavy) with hypertrophy accessories. Get strong and look it.",
    descriptionTh:
      "ผสมผสานการฝึกความแข็งแรง (reps น้อย น้ำหนักหนัก) กับ Accessory เพื่อ Hypertrophy ทั้งแข็งแรงและดูดี",
    goal: "get_stronger",
    difficulty: "intermediate",
    daysPerWeek: 4,
    isAdvanced: false,
    splitJson: split([
      {
        dayLabel: "Day 1 — Squat & Chest",
        exercises: [
          { exerciseSlug: "squat", sets: 5, reps: "3-5", notes: "Heavy, RPE 8-9" },
          { exerciseSlug: "barbell-bench-press", sets: 4, reps: "5-6" },
          { exerciseSlug: "leg-press", sets: 3, reps: "10-12" },
          { exerciseSlug: "incline-bench-press", sets: 3, reps: "8-10" },
          { exerciseSlug: "barbell-curl", sets: 3, reps: "10-12" },
        ],
      },
      {
        dayLabel: "Day 2 — Deadlift & OHP",
        exercises: [
          { exerciseSlug: "deadlift", sets: 4, reps: "3-4", notes: "Heavy, RPE 8-9" },
          { exerciseSlug: "overhead-press", sets: 4, reps: "5-6" },
          { exerciseSlug: "lat-pulldown", sets: 4, reps: "8-10" },
          { exerciseSlug: "romanian-deadlift", sets: 3, reps: "8-10" },
          { exerciseSlug: "tricep-pushdown", sets: 3, reps: "10-12" },
        ],
      },
      {
        dayLabel: "Day 3 — Bench & Back",
        exercises: [
          { exerciseSlug: "barbell-bench-press", sets: 4, reps: "8-10" },
          { exerciseSlug: "barbell-row", sets: 4, reps: "6-8" },
          { exerciseSlug: "close-grip-bench", sets: 3, reps: "8-10" },
          { exerciseSlug: "seated-cable-row", sets: 3, reps: "10-12" },
          { exerciseSlug: "hammer-curl", sets: 3, reps: "12-15" },
        ],
      },
      {
        dayLabel: "Day 4 — OHP & Squat Accessories",
        exercises: [
          { exerciseSlug: "overhead-press", sets: 4, reps: "8-10" },
          { exerciseSlug: "pull-up", sets: 4, reps: "6-10" },
          { exerciseSlug: "hack-squat", sets: 3, reps: "10-12" },
          { exerciseSlug: "lateral-raise", sets: 4, reps: "15-20" },
          { exerciseSlug: "skull-crusher", sets: 3, reps: "10-12" },
        ],
      },
    ]),
  },

  // 12 ─ Pure Cardio 3-Day ──────────────────────────────────────────────────
  {
    slug: "pure-cardio-3day",
    nameEn: "Cardio & Fat Burn 3×/Week",
    nameTh: "คาร์ดิโอและเผาไขมัน 3 วัน/สัปดาห์",
    descriptionEn:
      "3 cardio sessions per week mixing steady-state and HIIT to maximise fat burning.",
    descriptionTh: "คาร์ดิโอ 3 ครั้งต่อสัปดาห์ ผสมผสาน Steady State และ HIIT เพื่อเผาผลาญไขมันสูงสุด",
    goal: "lose_fat",
    difficulty: "beginner",
    daysPerWeek: 3,
    isAdvanced: false,
    splitJson: split([
      {
        dayLabel: "Day A — Steady State",
        exercises: [
          {
            exerciseSlug: "treadmill-run",
            sets: 1,
            reps: "30-40min",
            notes: "Moderate pace, conversational",
          },
          { exerciseSlug: "cycling", sets: 1, reps: "15min", notes: "Cool down" },
          { exerciseSlug: "jump-rope", sets: 3, reps: "2min" },
        ],
      },
      {
        dayLabel: "Day B — HIIT",
        exercises: [
          { exerciseSlug: "sprint-intervals", sets: 8, reps: "30s on/90s off" },
          { exerciseSlug: "battle-ropes", sets: 4, reps: "30s" },
          { exerciseSlug: "box-jump", sets: 4, reps: "8-10" },
          { exerciseSlug: "mountain-climber", sets: 4, reps: "30s" },
        ],
      },
      {
        dayLabel: "Day C — Mixed",
        exercises: [
          { exerciseSlug: "rowing-machine", sets: 1, reps: "20min" },
          { exerciseSlug: "stair-climber", sets: 1, reps: "15min" },
          { exerciseSlug: "high-knees", sets: 4, reps: "30s" },
          { exerciseSlug: "burpee", sets: 4, reps: "10-12" },
          { exerciseSlug: "elliptical", sets: 1, reps: "10min", notes: "Cool down" },
        ],
      },
    ]),
  },
];
