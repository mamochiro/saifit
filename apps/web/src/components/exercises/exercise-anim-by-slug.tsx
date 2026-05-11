import type React from "react";
import { AnimBench } from "./anim-bench";
import { AnimPlank } from "./anim-plank";
import { AnimPullUp } from "./anim-pullup";
import { AnimSquat } from "./anim-squat";

const SIZES = { sm: 36, md: 80, lg: 160, xl: 200 } as const;
export type AnimSize = keyof typeof SIZES;

type AnimComponent = React.ComponentType<{ size?: number; paused?: boolean }>;

const SLUG_MAP: Array<{ test: (s: string) => boolean; Component: AnimComponent }> = [
  { test: (s) => /squat|goblet/.test(s), Component: AnimSquat },
  { test: (s) => /bench|chest.press|press.chest/.test(s), Component: AnimBench },
  { test: (s) => /pull.?up|chin.?up|lat.pull|pulldown/.test(s), Component: AnimPullUp },
  { test: (s) => /plank|dead.?hang/.test(s), Component: AnimPlank },
];

interface Props {
  slug: string;
  size?: AnimSize;
  paused?: boolean;
  fallback?: React.ReactNode;
}

export function ExerciseAnimBySlug({ slug, size = "lg", paused, fallback = null }: Props) {
  const px = SIZES[size];
  const match = SLUG_MAP.find(({ test }) => test(slug));
  if (!match) return <>{fallback}</>;
  return <match.Component size={px} paused={paused ?? false} />;
}
