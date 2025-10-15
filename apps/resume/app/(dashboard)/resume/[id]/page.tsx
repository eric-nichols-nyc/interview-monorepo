"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getResumeAction } from "../../../../actions/resume/get-resume";
import { useResumeEditorStore } from "../../../../stores/resume-editor-store";
import { ResumeCreator } from "./_components/resume-creator";

export default function ResumePage({ params }: { params: { id: string } }) {
  const [id, setId] = useState<string | null>(null);

  // Get the ID from params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  // Query for resume data
  const { data: result, isLoading } = useQuery({
    queryKey: ["resume", id],
    queryFn: () => getResumeAction(id!),
    enabled: !!id,
  });

  // Initialize store when resume loads
  const { initializeResume, resetStore } = useResumeEditorStore();

  useEffect(() => {
    if (result?.success && result.data) {
      initializeResume(result.data);
    }
  }, [result?.success, result?.data, initializeResume]);

  useEffect(() => {
    // Cleanup store when component unmounts
    return () => {
      resetStore();
    };
  }, [resetStore]);

  if (!id || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-primary border-b-2" />
          <p>Loading resume...</p>
        </div>
      </div>
    );
  }

  if (!result.success) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 font-bold text-2xl text-destructive">Error</h1>
          <p>{result.error}</p>
        </div>
      </div>
    );
  }

  if (!result.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 font-bold text-2xl">Resume Not Found</h1>
          <p>The requested resume could not be found.</p>
        </div>
      </div>
    );
  }

  const resume = result.data;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="mb-2 font-bold text-3xl">{resume.name}</h1>
        {resume.targetRole && (
          <p className="text-lg text-muted-foreground">{resume.targetRole}</p>
        )}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ResumeCreator />
      </div>

      <div className="mt-6 rounded-lg border bg-card p-6">
        <h2 className="mb-4 font-semibold text-xl">Resume Data (Debug)</h2>
        <pre className="overflow-auto rounded-md bg-muted p-4 text-sm">
          {JSON.stringify(resume, null, 2)}
        </pre>
      </div>
    </div>
  );
}
