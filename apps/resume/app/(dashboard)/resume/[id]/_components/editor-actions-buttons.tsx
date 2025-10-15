"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { 
  Upload, 
  Download, 
  Save, 
  Loader2 
} from "lucide-react";
import { 
  useResumeEditorStore, 
  useHasUnsavedChanges, 
  useIsAutoSaving,
  useCanSave 
} from "../../../../../stores/resume-editor-store";

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
        variant="outline"
        size="sm"
        disabled={true}
        className="opacity-50"
      >
        <Upload className="mr-2 h-4 w-4" />
        Import
      </Button>

      {/* Download Button - Disabled for now */}
      <Button
        variant="outline"
        size="sm"
        disabled={true}
        className="opacity-50"
      >
        <Download className="mr-2 h-4 w-4" />
        Download
      </Button>

      {/* Save Button - Connected to store */}
      <Button
        variant="default"
        size="sm"
        onClick={handleSave}
        disabled={!canSave || isAutoSaving}
        className={hasUnsavedChanges ? "" : "opacity-60"}
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
