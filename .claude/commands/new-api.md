# /new-api — Scaffold a protected Next.js API route

Usage: `/new-api <method> <path>`
Examples: `/new-api GET /api/workouts`, `/new-api POST /api/workouts/[id]/sets`

Scaffold a production-ready API route for Saifit with Better Auth session check, Valibot validation, and Drizzle query.

## File to create

`apps/web/src/app/api/<path>/route.ts`

## Template

```ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { db } from "@saifit/db"
import * as v from "valibot"

// Input schema (for POST/PATCH — skip for GET/DELETE)
const BodySchema = v.object({
  // Define fields here
})

export async function METHOD(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Auth check — always first
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Parse + validate input (POST/PATCH only)
  let body: v.InferOutput<typeof BodySchema>
  try {
    const raw = await request.json()
    body = v.parse(BodySchema, raw)
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  // 3. Drizzle query — always filter by session.user.id
  // NEVER trust userId from the request body
  // const result = await db.query.workouts.findMany({
  //   where: eq(workouts.userId, session.user.id),
  // })

  // 4. Return
  return NextResponse.json({ data: {} })
}
```

## Rules
- Auth check is ALWAYS the first thing in every route
- NEVER use userId from request body — always use `session.user.id`
- Validate all inputs with Valibot — no raw `request.json()` without parsing
- Return `{ data: ... }` for success, `{ error: "..." }` for errors
- 401 for unauthenticated, 400 for bad input, 404 for not found, 500 for server error
- Public routes (GET /api/exercises, GET /api/templates): no auth required, still validate query params

After creating the file, print the full file path and a curl example showing how to test it locally.
