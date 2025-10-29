"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/design-system/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { Bug } from "lucide-react";
import { useEffect, useState } from "react";
import { getResumeAction } from "../../../../actions/resume/get-resume";
import { CollapsibleChat } from "../../../../components/chat/collapsible-chat";
import { useUnsavedChanges } from "../../../../hooks/use-unsaved-changes";
import {
  useHasUnsavedChanges,
  useResumeEditorStore,
} from "../../../../stores/resume-editor-store";
import { EditorActionsButtons } from "./_components/editor-actions-buttons";
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
    queryFn: () => getResumeAction(id ?? ""),
    enabled: !!id,
  });

  // Initialize store when resume loads
  const { initializeResume, resetStore } = useResumeEditorStore();
  const hasUnsavedChanges = useHasUnsavedChanges();

  // Warn about unsaved changes when navigating away
  useUnsavedChanges(hasUnsavedChanges, {
    message: "You have unsaved resume changes. Are you sure you want to leave?",
  });

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

  if (!id || isLoading || !result) {
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
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-amber-800">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="font-medium text-sm">Unsaved changes</span>
            </div>
          )}
        </div>
        <EditorActionsButtons />
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ResumeCreator />
      </div>

      {/* Fixed Debug Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="fixed bottom-6 left-6 h-12 w-12 rounded-full shadow-lg"
            size="icon"
            variant="secondary"
          >
            <Bug className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="h-[80vh]" side="bottom">
          <SheetHeader>
            <SheetTitle>Resume Data (Debug)</SheetTitle>
            <SheetDescription>
              View the complete resume data structure
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 overflow-auto">
            <pre className="rounded-md bg-muted p-4 text-sm">
              {JSON.stringify(resume, null, 2)}
            </pre>
          </div>
        </SheetContent>
      </Sheet>

      <CollapsibleChat />
    </div>
  );
}
