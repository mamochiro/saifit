import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "better-auth/types";
import { type NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up",
  "/offline",
  "/api/auth",
  "/api/templates",
  "/api/exercises",
];
const SKIP_ONBOARDING = ["/welcome", "/api/", "/auth/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const { data: session } = await betterFetch<Session>("/api/auth/get-session", {
    baseURL: request.nextUrl.origin,
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (SKIP_ONBOARDING.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const { data: user } = await betterFetch<{ onboardingCompleted: boolean }>("/api/me", {
    baseURL: request.nextUrl.origin,
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });

  if (user && !user.onboardingCompleted) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js).*)"],
};
