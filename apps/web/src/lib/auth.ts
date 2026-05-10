import { getDb, users } from "@gympal/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuthSchema } from "./auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(getDb(), { provider: "pg", schema: betterAuthSchema }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        }
      : {}),
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const db = getDb();
            await db
              .insert(users)
              .values({
                betterAuthId: user.id,
                displayName: user.name?.trim() || user.email?.split("@")[0] || "User",
                email: user.email ?? null,
                locale: "th",
              })
              .onConflictDoNothing();
          } catch (e) {
            console.error("Failed to create app user row:", e);
          }
        },
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET ?? "dev-secret-change-in-prod",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
});
