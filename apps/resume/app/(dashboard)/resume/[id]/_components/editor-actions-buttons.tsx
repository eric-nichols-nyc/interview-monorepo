"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Loader2, Save, Upload } from "lucide-react";
import {
  useCanSave,
  useHasUnsavedChanges,
  useIsAutoSaving,
  useResumeEditorStore,
} from "../../../../../stores/resume-editor-store";
import { ExportToPdfButton } from "./export-to-pdf-button";

export function EditorActionsButtons() {
  const saveToDatabase = useResumeEditorStore((state) => state.saveToDatabase);
  const hasUnsavedChanges = useHasUnsavedChanges();
  const isAutoSaving = useIsAutoSaving();
  const canSave = useCanSave();

  const handleSave = async () => {
    await saveToDatabase();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Import Button - Disabled for now */}
      <Button
        className="opacity-50"
        disabled={true}
        size="sm"
        variant="outline"
      >
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>

      {/* Download Button - Disabled for now */}
      <ExportToPdfButton />

      {/* Save Button - Connected to store */}
      <Button
        className={hasUnsavedChanges ? "" : "opacity-60"}
        disabled={!canSave || isAutoSaving}
        onClick={handleSave}
        size="sm"
        variant="default"
      >
        {isAutoSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {hasUnsavedChanges ? "Save Changes" : "Saved"}
          </>
        )}
      </Button>
    </div>
  );
}
