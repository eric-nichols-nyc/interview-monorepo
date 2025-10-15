import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "./types/supabase";
import { PrismaClient } from "./generated/prisma";
import { keys } from "./keys";

// Prisma client singleton
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Lazy initialization of Prisma client
function getPrismaClient() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    
    // Gracefully handle disconnection for Prisma 5.0+
    if (process.env.NODE_ENV !== "production") {
      process.on("beforeExit", async () => {
        await globalForPrisma.prisma?.$disconnect();
      });
      
      process.on("SIGINT", async () => {
        await globalForPrisma.prisma?.$disconnect();
        process.exit(0);
      });
      
      process.on("SIGTERM", async () => {
        await globalForPrisma.prisma?.$disconnect();
        process.exit(0);
      });
    }
  }
  return globalForPrisma.prisma;
}

// Use a getter to ensure Prisma is only instantiated when accessed
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

// Server-side Supabase client for Server Components, Server Actions, and Route Handlers
export async function createClient() {
  const cookieStore = await cookies();
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = keys();

  return createServerClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Legacy export for backwards compatibility
export const database = createClient;

// Re-export types
export type { Database } from "./types/supabase";
export * from "./generated/prisma";
