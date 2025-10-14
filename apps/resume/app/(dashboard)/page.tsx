"use client";

import { useAuth } from "@repo/auth/provider";
import { Button } from "@repo/design-system/components/ui/button";
import { CreateResumeDialog } from "../../components/create-resume-dialog";
import { Plus } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24 text-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
          <p>Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24 text-black">
      <div className="w-full max-w-5xl space-y-8 text-center">
        <h1 className="font-bold text-4xl">Resume Platform</h1>
        <p className="text-xl opacity-70">
          Welcome to your authenticated resume platform
        </p>

        <div className="flex justify-center gap-4">
          <CreateResumeDialog>
            <Button
              className="rounded-lg bg-primary px-6 py-3 font-medium text-black transition-opacity hover:opacity-90"
              type="button"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Resume
            </Button>
          </CreateResumeDialog>
          <Button
            className="rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:bg-muted"
            type="button"
          >
            View Resumes
          </Button>
        </div>
      </div>
    </main>
  );
}
