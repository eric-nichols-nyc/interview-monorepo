"use client";

import { useAuth } from "@repo/auth/provider";
import { Button } from "@repo/design-system/components/ui/button";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24 text-foreground">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24 text-foreground">
      <div className="w-full max-w-5xl space-y-8 text-center">
        <h1 className="font-bold text-4xl">Search Platform</h1>
        <p className="text-xl opacity-70">
          Welcome to your authenticated search platform
        </p>

        <div className="flex justify-center gap-4">
          <Button
            className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            type="button"
          >
            Get Started
          </Button>
          <Button
            className="rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:bg-muted"
            type="button"
          >
            Learn More
          </Button>
        </div>
      </div>
    </main>
  );
}
