import { EditorActionsButtons } from "./editor-actions-buttons";
import { InfoAccordion } from "./info-accordion";

export function EditorPanel() {
  return (
    <div className="flex h-full flex-col">
      <EditorActionsButtons />
      <InfoAccordion />
    </div>
  );
}
