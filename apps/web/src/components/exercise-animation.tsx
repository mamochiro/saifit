"use client";

// Drop /public/animations/exercise.json to activate — falls back to a dumbbell icon until then.

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const SIZES = { sm: 36, md: 80, lg: 160, xl: 200 } as const;
type Size = keyof typeof SIZES;

function DumbbellFallback({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width={Math.round(size * 0.5)}
        height={Math.round(size * 0.5)}
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="14" y="7" width="5" height="10" rx="2" />
        <rect x="5" y="7" width="5" height="10" rx="2" />
        <line x1="10" y1="12" x2="14" y2="12" />
        <line x1="2" y1="10" x2="5" y2="10" />
        <line x1="2" y1="14" x2="5" y2="14" />
        <line x1="19" y1="10" x2="22" y2="10" />
        <line x1="19" y1="14" x2="22" y2="14" />
      </svg>
    </div>
  );
}

export function ExerciseAnimation({ size = "lg" }: { size?: Size }) {
  const [data, setData] = useState<object | null | "missing">(null);
  const px = SIZES[size];

  useEffect(() => {
    let cancelled = false;
    fetch("/animations/exercise.json")
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json() as Promise<object>;
      })
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (!cancelled) setData("missing");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (data === null) {
    return (
      <div
        style={{
          width: px,
          height: px,
          borderRadius: 12,
          background: "rgba(255,255,255,0.04)",
          animation: "pulse 1.5s ease-in-out infinite",
          flexShrink: 0,
        }}
      />
    );
  }

  if (data === "missing") {
    return <DumbbellFallback size={px} />;
  }

  return (
    <Lottie
      animationData={data}
      loop
      style={{ width: px, height: px, flexShrink: 0 }}
      rendererSettings={{ preserveAspectRatio: "xMidYMid meet" }}
    />
  );
}
