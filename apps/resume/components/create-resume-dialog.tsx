"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design-system/components/ui/dialog";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProfile } from "../hooks/queries/profile-queries";
import { useCreateResume } from "../hooks/queries/resume-queries";

type CreateResumeDialogProps = {
  children: React.ReactNode;
};

export function CreateResumeDialog({ children }: CreateResumeDialogProps) {
  const [open, setOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const { data: profile } = useProfile();
  const createResume = useCreateResume();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!jobTitle.trim()) {
      setError("Job title is required");
      return;
    }

    try {
      const result = await createResume.mutateAsync({
        jobTitle: jobTitle.trim(),
        profile,
      });

      if (result.success && result.data) {
        setOpen(false);
        setJobTitle("");
        // Navigate to the new resume page
        router.push(`/resume/${result.data.id}`);
      } else {
        setError(result.error || "Failed to create resume");
      }
    } catch (_err) {
      setError("An unexpected error occurred");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setJobTitle("");
      setError("");
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Resume</DialogTitle>
          <DialogDescription>
            Enter the job title for this resume. Your profile information will
            be automatically included.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title *</Label>
              <Input
                className={error ? "border-destructive" : ""}
                disabled={createResume.isPending}
                id="job-title"
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g., Frontend Developer, Product Manager"
                value={jobTitle}
              />
              {error && <p className="text-destructive text-sm">{error}</p>}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              disabled={createResume.isPending}
              onClick={() => setOpen(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={createResume.isPending || !jobTitle.trim()}
              type="submit"
            >
              {createResume.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Resume
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
