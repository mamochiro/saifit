import { auth } from "@/lib/auth";
import { getDb, streaks, templates, userPrograms, users } from "@saifit/db";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Link from "next/link";

interface SplitDay {
  dayLabel: string;
  exercises: Array<{
    exerciseSlug: string;
    sets: number;
    reps: string;
    notes?: string;
  }>;
}

export default async function HomePage() {
  const t = await getTranslations();
  const session = await auth.api.getSession({ headers: await headers() });

  // Session guaranteed by middleware — guard for TypeScript
  if (!session) return null;

  const db = getDb();
  const user = await db.query.users.findFirst({
    where: eq(users.betterAuthId, session.user.id),
  });

  if (!user) return null;

  const [streakRow, activeProgramRows] = await Promise.all([
    db.query.streaks.findFirst({ where: eq(streaks.userId, user.id) }),
    db
      .select({
        id: userPrograms.id,
        startedAt: userPrograms.startedAt,
        templateId: userPrograms.templateId,
        nameTh: templates.nameTh,
        daysPerWeek: templates.daysPerWeek,
        splitJson: templates.splitJson,
      })
      .from(userPrograms)
      .leftJoin(templates, eq(userPrograms.templateId, templates.id))
      .where(eq(userPrograms.userId, user.id))
      .limit(1),
  ]);

  // Filter to active program in application code (avoids boolean eq compat issues)
  const activeProgramRow = activeProgramRows[0] ?? null;
  const activeProgram = activeProgramRow && activeProgramRows.length > 0 ? activeProgramRow : null;

  // Calculate today's split day
  let todayDay: SplitDay | null = null;
  if (activeProgram?.splitJson) {
    const splitJson = activeProgram.splitJson as { days: SplitDay[] };
    const startMs =
      activeProgram.startedAt instanceof Date
        ? activeProgram.startedAt.getTime()
        : new Date(activeProgram.startedAt).getTime();
    const daysSinceStart = Math.floor((Date.now() - startMs) / 86_400_000);
    const idx = daysSinceStart % splitJson.days.length;
    todayDay = splitJson.days[idx] ?? null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-4 pt-10 space-y-8">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold leading-[1.7]">
            {t("home.greeting")}, {user.displayName}
          </h1>
        </div>

        {/* Streak banner — only when streak exists */}
        {streakRow && streakRow.currentStreak > 0 && (
          <div className="bg-card border border-border rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground leading-[1.7]">{t("home.streak")}</span>
            <span className="font-display tabular-nums text-2xl font-bold">
              {streakRow.currentStreak}
            </span>
          </div>
        )}

        {/* Today's workout */}
        {activeProgram ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("home.todayWorkout")}</h2>
              {todayDay && (
                <span className="text-xs text-muted-foreground">{todayDay.dayLabel}</span>
              )}
            </div>

            {todayDay && (
              <>
                <div className="border border-border rounded-xl overflow-hidden">
                  {todayDay.exercises.map((ex) => (
                    <div
                      key={ex.exerciseSlug}
                      className="flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0"
                    >
                      <span className="text-sm leading-[1.7]">
                        {ex.exerciseSlug.replace(/-/g, " ")}
                      </span>
                      <span className="text-sm text-muted-foreground tabular-nums shrink-0 ml-4">
                        {ex.sets}×{ex.reps}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/workout"
                  className="flex items-center justify-center w-full min-h-14 bg-primary text-primary-foreground font-semibold rounded-xl transition-colors"
                >
                  {t("home.startWorkout")}
                </Link>
              </>
            )}
          </div>
        ) : (
          /* No active program — empty state */
          <div className="py-12 text-center space-y-4">
            <p className="text-foreground font-medium leading-[1.7]">{t("home.noProgram")}</p>
            <p className="text-sm text-muted-foreground leading-[1.7]">
              เลือกโปรแกรมเพื่อเริ่มต้นออกกำลังกาย
            </p>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center mt-2 px-8 min-h-14 bg-primary text-primary-foreground font-semibold rounded-xl"
            >
              {t("home.browseTemplates")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
