# /new-page — Scaffold a Next.js page with full GymPal boilerplate

Usage: `/new-page <route>`
Examples: `/new-page /progress`, `/new-page /workout/[id]`

Scaffold a production-ready Next.js App Router page for GymPal. Follow this exact pattern:

## File structure to create

Given route `/foo/[bar]`:
- `apps/web/src/app/[locale]/foo/[bar]/page.tsx` — Server Component (data fetching)
- `apps/web/src/app/[locale]/foo/[bar]/loading.tsx` — Skeleton
- `apps/web/src/app/[locale]/foo/[bar]/error.tsx` — Error boundary
- `apps/web/src/components/foo/[bar]-view.tsx` — Client Component (interactivity)

## page.tsx template
```tsx
import { getTranslations } from "next-intl/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { FooView } from "@/components/foo/foo-view"

export async function generateMetadata() {
  const t = await getTranslations("FooPage")
  return { title: t("title") }
}

export default async function FooPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/sign-in")

  // Fetch data here using Drizzle via @gympal/db
  // Pass as props to Client Component

  return <FooView />
}
```

## loading.tsx template
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function FooLoading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
}
```

## error.tsx template
```tsx
"use client"
import { Button } from "@/components/ui/button"

export default function FooError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-destructive">{error.message}</p>
      <Button onClick={reset}>ลองใหม่ / Try again</Button>
    </div>
  )
}
```

## i18n keys to add
After creating files, add to both `messages/th.json` and `messages/en.json`:
```json
"FooPage": {
  "title": "...",
  "emptyState": "...",
  "loading": "..."
}
```

## Rules
- Thai strings go in th.json, English in en.json — never hardcode either language
- All interactive parts in Client Components (`"use client"`)
- All data fetching in Server Components
- Empty state required: if data could be empty, render an encouraging message
- Min tap target 56px for any interactive element
- Line-height: `leading-relaxed` or higher for any Thai text

After creating files, print the list of files created and the i18n keys added.
