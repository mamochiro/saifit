import type React from "react";
import { AnimBench } from "./anim-bench";
import { AnimDeadlift } from "./anim-deadlift";
import { AnimOHP } from "./anim-ohp";
import { AnimPlank } from "./anim-plank";
import { AnimPullUp } from "./anim-pullup";
import { AnimRow } from "./anim-row";
import { AnimSquat } from "./anim-squat";

const SIZES = { sm: 36, md: 80, lg: 160, xl: 200 } as const;
export type AnimSize = keyof typeof SIZES;

type AnimComponent = React.ComponentType<{ size?: number; paused?: boolean }>;

// Slug keyword → animation (first match wins)
const SLUG_MAP: Array<{ test: (s: string) => boolean; Component: AnimComponent }> = [
  { test: (s) => /squat|goblet|lunge/.test(s), Component: AnimSquat },
  { test: (s) => /bench|chest.press/.test(s), Component: AnimBench },
  { test: (s) => /pull.?up|chin.?up|lat.pull|pulldown/.test(s), Component: AnimPullUp },
  { test: (s) => /plank|dead.?hang/.test(s), Component: AnimPlank },
  { test: (s) => /deadlift|rdl|romanian|rack.pull|hip.hinge/.test(s), Component: AnimDeadlift },
  { test: (s) => /overhead.press|ohp|military|shoulder.press/.test(s), Component: AnimOHP },
  { test: (s) => /\brow\b|bent.over|cable.row|t.bar/.test(s), Component: AnimRow },
];

// Category → animation fallback (covers every exercise without a specific slug match)
const CATEGORY_MAP: Record<string, AnimComponent> = {
  chest: AnimBench,
  back: AnimRow,
  legs: AnimSquat,
  shoulders: AnimOHP,
  arms: AnimPullUp,
  core: AnimPlank,
  cardio: AnimPlank,
  full_body: AnimSquat,
};

interface Props {
  slug: string;
  category?: string;
  size?: AnimSize;
  paused?: boolean;
  fallback?: React.ReactNode;
}

export function ExerciseAnimBySlug({
  slug,
  category,
  size = "lg",
  paused,
  fallback = null,
}: Props) {
  const px = SIZES[size];
  const slugMatch = SLUG_MAP.find(({ test }) => test(slug));
  const Component = slugMatch?.Component ?? (category ? CATEGORY_MAP[category] : undefined);
  if (!Component) return <>{fallback}</>;
  return <Component size={px} paused={paused ?? false} />;
}
