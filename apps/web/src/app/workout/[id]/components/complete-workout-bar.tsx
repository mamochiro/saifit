"use client";

import { useViewportStore } from "@/stores/viewport-store";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function CompleteWorkoutBar({ workoutId }: { workoutId: string }) {
  const t = useTranslations("workout");
  const router = useRouter();
  const keyboardHeight = useViewportStore((s) => s.keyboardHeight);
  const keyboardOpen = useViewportStore((s) => s.keyboardOpen);

  const mutation = useMutation({
    mutationFn: () =>
      fetch(`/api/workouts/${workoutId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completedAt: new Date().toISOString(),
          durationSeconds: 0,
        }),
      }),
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  // Hide when keyboard is open — rest timer takes that space
  if (keyboardOpen) return null;

  return (
    <div
      className="fixed left-0 right-0 z-30 flex justify-end px-4 py-4 bg-background border-t border-border"
      style={{ bottom: keyboardHeight }}
    >
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="h-14 px-8 bg-primary text-primary-foreground font-semibold rounded-xl disabled:opacity-50 transition-colors"
      >
        {mutation.isPending ? "..." : t("completeWorkout")}
      </button>
    </div>
  );
}
