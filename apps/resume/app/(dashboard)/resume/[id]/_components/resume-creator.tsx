import { EditorPanel } from "./editor-panel";
import { HtmlPreviewPanel } from "./html-preview-panel";

export function ResumeCreator() {
  return (
    <div className="flex h-full">
      <div className="w-1/3">
        <EditorPanel />
      </div>
      <div className="w-2/3">
        <HtmlPreviewPanel />
      </div>
    </div>
  );
}
