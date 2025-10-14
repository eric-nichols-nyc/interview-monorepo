"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design-system/components/ui/dialog";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { useProfile } from "../hooks/queries/profile-queries";
import { useCreateResume } from "../hooks/queries/resume-queries";
import { Loader2 } from "lucide-react";

interface CreateResumeDialogProps {
  children: React.ReactNode;
}

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
    } catch (err) {
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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Resume</DialogTitle>
          <DialogDescription>
            Enter the job title for this resume. Your profile information will be
            automatically included.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title *</Label>
              <Input
                id="job-title"
                placeholder="e.g., Frontend Developer, Product Manager"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                disabled={createResume.isPending}
                className={error ? "border-destructive" : ""}
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createResume.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createResume.isPending || !jobTitle.trim()}
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