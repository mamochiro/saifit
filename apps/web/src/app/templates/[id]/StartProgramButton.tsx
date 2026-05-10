"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StartProgramButton({
  templateId,
  isActive,
}: {
  templateId: string;
  isActive: boolean;
}) {
  const t = useTranslations("templates");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      fetch("/api/programs/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId }),
      }).then((r) => {
        if (!r.ok) throw new Error("Failed");
        return r.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs", "active"] });
      router.push("/");
      router.refresh();
    },
    onError: () => setError("เกิดข้อผิดพลาด กรุณาลองใหม่"),
  });

  if (isActive) {
    return (
      <div className="w-full min-h-14 rounded-xl border border-border flex items-center justify-center">
        <span className="text-sm text-muted-foreground">{t("currentlyActive")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-xs text-destructive text-center leading-[1.7]">{error}</p>}
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="w-full min-h-14 bg-primary text-primary-foreground font-semibold rounded-xl disabled:opacity-50 transition-colors"
      >
        {mutation.isPending ? "กำลังบันทึก..." : t("startProgram")}
      </button>
    </div>
  );
}
