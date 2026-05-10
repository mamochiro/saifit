"use client";

import { useViewportStore } from "@/stores/viewport-store";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function CompleteWorkoutBar({
  workoutId,
  startedAt,
}: {
  workoutId: string;
  startedAt: string;
}) {
  const t = useTranslations("workout");
  const router = useRouter();
  const keyboardHeight = useViewportStore((s) => s.keyboardHeight);
  const keyboardOpen = useViewportStore((s) => s.keyboardOpen);

  const mutation = useMutation({
    mutationFn: () => {
      const durationSeconds = Math.round((Date.now() - new Date(startedAt).getTime()) / 1000);
      return fetch(`/api/workouts/${workoutId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completedAt: new Date().toISOString(),
          durationSeconds,
        }),
      });
    },
    onSuccess: () => {
      router.push("/");
      router.refresh();
    },
  });

  if (keyboardOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: keyboardHeight,
        zIndex: 30,
        display: "flex",
        justifyContent: "flex-end",
        padding: "12px 24px",
        background: "rgba(8, 8, 16, 0.75)",
        WebkitBackdropFilter: "blur(20px) saturate(140%)",
        backdropFilter: "blur(20px) saturate(140%)",
        borderTop: "1px solid var(--glass-line)",
      }}
    >
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="btn-primary"
        style={{ height: 52, padding: "0 28px", fontSize: 15 }}
      >
        {mutation.isPending ? "..." : t("completeWorkout")}
      </button>
    </div>
  );
}
