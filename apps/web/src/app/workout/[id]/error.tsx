"use client";

import { useEffect } from "react";

export default function WorkoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
      <p className="text-foreground font-semibold text-lg">เกิดข้อผิดพลาด</p>
      <p className="text-sm text-muted-foreground leading-[1.7] text-center">{error.message}</p>
      <button
        type="button"
        onClick={reset}
        className="h-12 px-6 bg-primary text-primary-foreground font-semibold rounded-xl"
      >
        ลองใหม่
      </button>
    </div>
  );
}
