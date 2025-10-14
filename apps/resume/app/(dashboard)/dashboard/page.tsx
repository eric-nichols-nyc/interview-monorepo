"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Calendar, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { useResumes } from "../../../hooks/queries/resume-queries";
import { CreateResumeDialog } from "../../../components/create-resume-dialog";

export default function DashboardPage() {
  const { data: resumes = [], isLoading, error } = useResumes();

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">Loading your resumes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-destructive">
          Failed to load resumes. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">My Resumes</h1>
          <p className="mt-2 text-muted-foreground">
            Manage and create your resumes
          </p>
        </div>
        <CreateResumeDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Resume
          </Button>
        </CreateResumeDialog>
      </div>

      {resumes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-lg">No resumes yet</h3>
            <p className="mb-6 max-w-md text-center text-muted-foreground">
              Get started by creating your first resume. You can tailor it for
              different jobs and applications.
            </p>
            <CreateResumeDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Resume
              </Button>
            </CreateResumeDialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Link href={`/resume/${resume.id}`} key={resume.id}>
              <Card className="cursor-pointer transition-shadow hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {resume.name}
                  </CardTitle>
                  {resume.targetRole && (
                    <CardDescription>{resume.targetRole}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-muted-foreground text-sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </div>
                  {resume.isBaseResume && (
                    <div className="mt-2">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 font-medium text-blue-700 text-xs ring-1 ring-blue-700/10 ring-inset">
                        Base Resume
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
